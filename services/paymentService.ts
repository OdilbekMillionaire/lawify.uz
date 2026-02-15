
// Service to handle Payment Links

export const generatePaymeLink = (amount: number, userId: string) => {
    // Payme Merchant ID (Get this from Payme dashboard later)
    const MERCHANT_ID = "67b05d..."; // Placeholder
    
    // Payme expects amount in Tiyin (Sum * 100)
    const amountInTiyin = amount * 100;
    
    // Base64 encode the params: m=MERCHANT_ID;ac.user_id=USER_ID;a=AMOUNT
    const params = `m=${MERCHANT_ID};ac.user_id=${userId};a=${amountInTiyin}`;
    const base64Params = btoa(params);
    
    return `https://checkout.paycom.uz/${base64Params}`;
};

export const generateClickLink = (amount: number, userId: string) => {
    // UPDATED FROM SCREENSHOTS
    const SERVICE_ID = "94567"; 
    const MERCHANT_ID = "76619"; 
    
    return `https://my.click.uz/services/pay?service_id=${SERVICE_ID}&merchant_id=${MERCHANT_ID}&amount=${amount}&transaction_param=${userId}`;
};
