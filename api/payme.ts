
import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

const PaymeError = {
  TransactionNotFound: -31003,
  InvalidAmount: -31001,
  OrderNotFound: -31050,
  CantPerform: -31008,
  AlreadyDone: -31007,
  SystemError: -32603,
  InsufficientPrivilege: -32504
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  try {
    const body = await req.json();
    const { method, params, id } = body;

    // 1. Basic Auth Check
    // If you haven't received the KEY from them yet, we skip strict checking solely for the initial test
    // so they don't get a "401 Unauthorized" before they even give you the key.
    const authHeader = req.headers.get('authorization');
    if (process.env.PAYME_SECRET_KEY) {
        const expectedAuth = `Basic ${btoa("Paycom:" + process.env.PAYME_SECRET_KEY)}`;
        if (!authHeader || authHeader !== expectedAuth) {
            return new Response(JSON.stringify({
                error: { code: PaymeError.InsufficientPrivilege, message: "Insufficient privileges" },
                id
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
    }

    const supabaseUrl = 'https://lsmmrbflyrmavounigdn.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseKey) {
        // Fallback for initial connection test if env var is missing
        console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey || 'place_holder_key');

    let result = {};

    switch (method) {
        case 'CheckPerformTransaction': {
            const { account, amount } = params;
            
            // Check if user exists
            const { data: user } = await supabase.from('profiles').select('id').eq('id', account.user_id).single();
            if (!user) {
                return jsonRpcError(id, PaymeError.OrderNotFound, "User not found");
            }

            // *** THIS IS WHAT THEY ASKED FOR IN THE SCREENSHOTS ***
            // We must return 'detail' with receipt_type and items (Soliq data)
            result = { 
                allow: true,
                detail: {
                    receipt_type: 0, 
                    items: [
                        {
                            title: "Lawify Pro Subscription", 
                            price: amount, // Amount in tiyin
                            count: 1,
                            code: "10302001001000000", // Generic Service Code (MXIK)
                            units: 2441, // Unit: pieces
                            vat_percent: 0, 
                            package_code: "123456" 
                        }
                    ]
                }
            };
            break;
        }

        case 'CreateTransaction': {
            const { account, time, amount, id: transId } = params;
            
            const { data: existing } = await supabase
                .from('transactions')
                .select('*')
                .eq('external_id', transId)
                .single();

            if (existing) {
                if (existing.status !== 'pending') {
                    return jsonRpcError(id, PaymeError.CantPerform, "Transaction already processed");
                }
                result = {
                    create_time: new Date(existing.created_at).getTime(),
                    transaction: existing.id,
                    state: 1
                };
            } else {
                const { data: newTrans, error } = await supabase
                    .from('transactions')
                    .insert({
                        user_id: account.user_id,
                        provider: 'payme',
                        amount: amount / 100,
                        external_id: transId,
                        status: 'pending',
                        perform_time: time
                    })
                    .select()
                    .single();

                if (error) throw error;

                result = {
                    create_time: new Date(newTrans.created_at).getTime(),
                    transaction: newTrans.id,
                    state: 1
                };
            }
            break;
        }

        case 'PerformTransaction': {
            const { id: transId } = params;
            const { data: trans } = await supabase.from('transactions').select('*').eq('external_id', transId).single();

            if (!trans) return jsonRpcError(id, PaymeError.TransactionNotFound, "Transaction not found");

            if (trans.status === 'paid') {
                return new Response(JSON.stringify({
                    result: {
                        perform_time: Number(trans.perform_time),
                        transaction: trans.id,
                        state: 2
                    },
                    id
                }), { headers: { 'Content-Type': 'application/json' } });
            }

            await supabase.from('transactions').update({ status: 'paid' }).eq('id', trans.id);

            // Activate subscription
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30);
            await supabase.from('profiles').update({
                is_pro: true,
                plan_type: 'month',
                subscription_end_date: endDate.toISOString()
            }).eq('id', trans.user_id);

            result = {
                perform_time: Number(trans.perform_time),
                transaction: trans.id,
                state: 2
            };
            break;
        }

        case 'CheckTransaction': {
             const { id: transId } = params;
             const { data: trans } = await supabase.from('transactions').select('*').eq('external_id', transId).single();
             
             if (!trans) return jsonRpcError(id, PaymeError.TransactionNotFound, "Not found");
             
             result = {
                 create_time: new Date(trans.created_at).getTime(),
                 perform_time: Number(trans.perform_time || 0),
                 cancel_time: 0,
                 transaction: trans.id,
                 state: trans.status === 'paid' ? 2 : 1,
                 reason: null
             };
             break;
        }
        
        default:
            return jsonRpcError(id, -32601, "Method not found");
    }

    return new Response(JSON.stringify({ result, id }), {
        headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Payme Error:", error);
    return new Response(JSON.stringify({ error: { code: -32603, message: "Internal Error" }, id: null }), { status: 200 });
  }
}

function jsonRpcError(id: any, code: number, message: string) {
    return new Response(JSON.stringify({
        error: { code, message },
        id
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
