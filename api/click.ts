
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Remove 'edge' runtime config to default to Node.js
// This allows us to use the 'crypto' module required for Click's MD5 check

// Helper to create MD5 hash using Node's crypto library
const createMd5 = (str: string) => crypto.createHash('md5').update(str).digest('hex');

export default async function handler(req: any, res: any) {
  // In Node.js environment, we use res.status().send() instead of returning new Response()
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // Vercel automatically parses 'application/x-www-form-urlencoded' into req.body
    const body = req.body || {};

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
        return res.status(200).json({ error: -1, error_note: "Server Config Error" });
    }
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 2. SIGNATURE CHECK (Security)
    if (process.env.CLICK_SECRET_KEY) {
        const secretKey = process.env.CLICK_SECRET_KEY;
        const mySignature = createMd5(
            `${click_trans_id}${service_id}${secretKey}${merchant_trans_id}${action === '1' ? amount : ''}${action}${sign_time}`
        );
        if (sign_string !== mySignature) {
            return res.status(200).json({ error: -1, error_note: "Invalid Signature" });
        }
    }

    // 3. HANDLE ACTIONS
    // Action 0: PREPARE
    if (action === '0') {
        const { data: user } = await supabase.from('profiles').select('id').eq('id', merchant_trans_id).single();
        
        if (!user) {
            return res.status(200).json({
                error: -5017,
                error_note: "User not found"
            });
        }

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
             return res.status(200).json({ error: -1, error_note: "Database Error" });
        }

        return res.status(200).json({
            click_trans_id,
            merchant_trans_id,
            merchant_prepare_id: trans.id,
            error: 0,
            error_note: "Success"
        });
    }

    // Action 1: COMPLETE
    if (action === '1') {
        const { data: trans } = await supabase
            .from('transactions')
            .select('*')
            .eq('external_id', click_trans_id)
            .single();

        if (!trans) {
             return res.status(200).json({ error: -5017, error_note: "Transaction not found" });
        }

        if (trans.status === 'paid') {
             return res.status(200).json({
                click_trans_id,
                merchant_trans_id,
                merchant_confirm_id: trans.id,
                error: -5017,
                error_note: "Already paid"
            });
        }

        if (parseInt(amount) !== parseInt(trans.amount)) {
             return res.status(200).json({ error: -5017, error_note: "Amount mismatch" });
        }

        await supabase.from('transactions').update({ status: 'paid' }).eq('id', trans.id);

        let plan = 'month';
        if (amount < 20000) plan = 'day';
        else if (amount > 200000) plan = 'lawyer';

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await supabase.from('profiles').update({
            is_pro: true,
            plan_type: plan,
            subscription_end_date: endDate.toISOString()
        }).eq('id', trans.user_id);

        return res.status(200).json({
            click_trans_id,
            merchant_trans_id,
            merchant_confirm_id: trans.id,
            error: 0,
            error_note: "Success"
        });
    }

    return res.status(200).json({ error: -1, error_note: "Unknown Action" });

  } catch (error: any) {
    console.error("Click Error:", error);
    return res.status(200).json({ error: -1, error_note: "Internal Error" });
  }
}
