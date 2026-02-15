
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export const config = {
  runtime: 'edge',
};

// Helper to create MD5 hash
const createMd5 = (str: string) => crypto.createHash('md5').update(str).digest('hex');

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    // Click sends data as Form Data, not JSON
    const formData = await req.formData();
    const body: any = {};
    formData.forEach((value, key) => (body[key] = value));

    const {
      click_trans_id,
      service_id,
      merchant_trans_id,
      amount,
      action,
      error,
      error_note,
      sign_time,
      sign_string,
      click_paydoc_id,
    } = body;

    // 1. DATABASE CONNECTION
    const supabaseUrl = 'https://lsmmrbflyrmavounigdn.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseKey) {
        return new Response(JSON.stringify({ error: -1, error_note: "Server Config Error" }));
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. SIGNATURE CHECK (Security)
    // Only check if we have the secret key. If not, skip (for initial connection test).
    if (process.env.CLICK_SECRET_KEY) {
        const secretKey = process.env.CLICK_SECRET_KEY;
        const mySignature = createMd5(
            `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${action === '1' ? amount : ''}${action}${sign_time}`
        );
        if (sign_string !== mySignature) {
            return new Response(JSON.stringify({ error: -1, error_note: "Invalid Signature" }));
        }
    }

    // 3. HANDLE ACTIONS
    // Action 0: PREPARE (Can we accept this payment?)
    if (action === '0') {
        const { data: user } = await supabase.from('profiles').select('id').eq('id', merchant_trans_id).single();
        
        if (!user) {
            return new Response(JSON.stringify({
                error: -5017, // User not found code for Click
                error_note: "User not found"
            }));
        }

        // Create a pending transaction
        const { data: trans, error: transError } = await supabase
            .from('transactions')
            .insert({
                user_id: merchant_trans_id,
                provider: 'click',
                amount: amount, 
                external_id: click_trans_id,
                status: 'pending',
                perform_time: Date.now()
            })
            .select()
            .single();

        if (transError) {
             return new Response(JSON.stringify({ error: -1, error_note: "Database Error" }));
        }

        return new Response(JSON.stringify({
            click_trans_id,
            merchant_trans_id,
            merchant_prepare_id: trans.id,
            error: 0,
            error_note: "Success"
        }));
    }

    // Action 1: COMPLETE (Perform the payment)
    if (action === '1') {
        const { data: trans } = await supabase
            .from('transactions')
            .select('*')
            .eq('external_id', click_trans_id)
            .single();

        if (!trans) {
             return new Response(JSON.stringify({ error: -5017, error_note: "Transaction not found" }));
        }

        if (trans.status === 'paid') {
             return new Response(JSON.stringify({
                click_trans_id,
                merchant_trans_id,
                merchant_confirm_id: trans.id,
                error: -5017, // Already paid
                error_note: "Already paid"
            }));
        }

        if (parseInt(amount) !== parseInt(trans.amount)) {
             return new Response(JSON.stringify({ error: -5017, error_note: "Amount mismatch" }));
        }

        // Mark as paid
        await supabase.from('transactions').update({ status: 'paid' }).eq('id', trans.id);

        // Activate Subscription
        let plan = 'month';
        if (amount < 20000) plan = 'day';
        else if (amount > 200000) plan = 'lawyer';

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30); // Add 30 days

        await supabase.from('profiles').update({
            is_pro: true,
            plan_type: plan,
            subscription_end_date: endDate.toISOString()
        }).eq('id', trans.user_id);

        return new Response(JSON.stringify({
            click_trans_id,
            merchant_trans_id,
            merchant_confirm_id: trans.id,
            error: 0,
            error_note: "Success"
        }));
    }

    return new Response(JSON.stringify({ error: -1, error_note: "Unknown Action" }));

  } catch (error: any) {
    console.error("Click Error:", error);
    return new Response(JSON.stringify({ error: -1, error_note: "Internal Error" }));
  }
}
