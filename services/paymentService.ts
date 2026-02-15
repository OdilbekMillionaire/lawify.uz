
// Service to handle Payment Links

export const generatePaymeLink = (amount: number, userId: string) => {
    // Payme Merchant ID (Replace with Env Var in real app, hardcoded for now or passed from config)
    const MERCHANT_ID = "64f...YOUR_ID"; // User must replace this
    
    // Payme expects amount in Tiyin (Sum * 100)
    const amountInTiyin = amount * 100;
    
    const params = `m=${MERCHANT_ID};ac.user_id=${userId};a=${amountInTiyin}`;
    const base64Params = btoa(params);
    
    return `https://checkout.paycom.uz/${base64Params}`;
};

export const generateClickLink = (amount: number, userId: string) => {
    const SERVICE_ID = "YOUR_SERVICE_ID";
    const MERCHANT_ID = "YOUR_MERCHANT_ID";
    
    return `https://my.click.uz/services/pay?service_id=${SERVICE_ID}&merchant_id=${MERCHANT_ID}&amount=${amount}&transaction_param=${userId}`;
};
