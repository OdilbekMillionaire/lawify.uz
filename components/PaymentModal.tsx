import React, { useState, useRef } from 'react';
import { verifyPaymentScreenshot } from '../services/geminiService';
import { activateProSubscription } from '../services/supabaseClient';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: string;
  planKey: 'day' | 'week' | 'month' | 'lawyer';
  userId: string;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, onClose, planName, amount, planKey, userId, onSuccess 
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast here but button text feedback is enough
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError("Please upload a screenshot of your payment.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      // 1. Convert to Base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        
        // 2. Send to Gemini for verification
        const result = await verifyPaymentScreenshot(base64String, amount);
        
        if (result.verified) {
          setSuccess(true);
          // 3. Activate Subscription
          await activateProSubscription(userId, planKey);
          
          setTimeout(() => {
            onSuccess();
            onClose();
          }, 2000);
        } else {
          setError(`Verification Failed: ${result.reason}`);
          setIsVerifying(false);
        }
      };
      
    } catch (err) {
      console.error(err);
      setError("An error occurred during verification.");
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Checkout</h3>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{planName} • {amount} UZS/mo</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
               <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-2 animate-bounce">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
               </div>
               <h3 className="text-2xl font-bold text-slate-800">Payment Verified!</h3>
               <p className="text-gray-500">Your Pro subscription has been activated.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Amount Display */}
              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                <p className="text-xs text-blue-600 font-bold uppercase mb-1">Amount Due</p>
                <p className="text-3xl font-extrabold text-slate-900">{amount} UZS/mo</p>
                <p className="text-xs text-gray-500 mt-1">Please transfer EXACT amount</p>
              </div>

              {/* Card Details */}
              <div className="space-y-4">
                <p className="text-xs font-bold text-gray-400 uppercase text-center">Select Payment Method</p>
                
                <div className="grid grid-cols-1 gap-4 mt-2">
                    {/* HUMO Card */}
                    <div 
                        onClick={() => handleCopy("9860010102408712")} 
                        className="cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-400 to-amber-600 p-5 text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="font-bold tracking-wider opacity-90 text-xl italic">HUMO</span>
                            <svg className="w-8 h-8 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4h20v16H2z" opacity="0.1"/><path d="M4 10h3v4H4zM9 10h3v4H9zM14 10h6v4h-6z"/></svg>
                        </div>
                        <p className="font-mono text-lg tracking-widest shadow-black drop-shadow-md mb-4">9860 0101 0240 8712</p>
                        <div className="flex justify-between items-center">
                             <span className="text-[10px] opacity-75 font-bold">JUSTME UZBEKISTAN</span>
                             <span className="text-[10px] bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors font-bold flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Tap to Copy
                             </span>
                        </div>
                    </div>

                    {/* UZCARD Card */}
                    <div 
                        onClick={() => handleCopy("5614684603157569")} 
                        className="cursor-pointer group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-indigo-800 p-5 text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <span className="font-bold tracking-wider opacity-90 text-xl italic">UZCARD</span>
                            <svg className="w-8 h-8 opacity-60" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4h20v16H2z" opacity="0.1"/><path d="M4 10h3v4H4zM9 10h3v4H9zM14 10h6v4h-6z"/></svg>
                        </div>
                        <p className="font-mono text-lg tracking-widest shadow-black drop-shadow-md mb-4">5614 6846 0315 7569</p>
                        <div className="flex justify-between items-center">
                             <span className="text-[10px] opacity-75 font-bold">JUSTME UZBEKISTAN</span>
                             <span className="text-[10px] bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition-colors font-bold flex items-center">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                Tap to Copy
                             </span>
                        </div>
                    </div>
                </div>
              </div>

              {/* Upload Section */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase">Proof of Payment</p>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    previewUrl ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*"
                    className="hidden" 
                  />
                  
                  {previewUrl ? (
                    <div className="relative">
                      <img src={previewUrl} alt="Receipt" className="max-h-40 mx-auto rounded-lg shadow-sm" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                        <span className="text-white text-xs font-bold bg-black/50 px-3 py-1 rounded-full">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-4">
                      <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <p className="text-sm text-gray-600 font-medium">Upload Screenshot/Photo</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                   <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   {error}
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={handleSubmit}
                disabled={isVerifying || !selectedFile}
                className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying Receipt (AI)...
                  </>
                ) : (
                  `I have sent ${amount} UZS`
                )}
              </button>
              
              <p className="text-center text-[10px] text-orange-500 font-medium">* Please upload proof of payment to continue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;