
import React, { useState, useRef } from 'react';
import { verifyPaymentScreenshot } from '../services/geminiService';
import { activateProSubscription } from '../services/supabaseClient';
import { generatePaymeLink, generateClickLink } from '../services/paymentService';

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
  const [activeMethod, setActiveMethod] = useState<'auto' | 'manual'>('auto');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean amount string to number (remove spaces, UZS)
  const numericAmount = parseInt(amount.replace(/\D/g, ''), 10);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleSubmitManual = async () => {
    if (!selectedFile) {
      setError("Please upload a screenshot of your payment.");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const result = await verifyPaymentScreenshot(base64String, amount);
        
        if (result.verified) {
          setSuccess(true);
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

  const handlePaymeClick = () => {
      // In a real scenario, you'd replace the ID in services/paymentService.ts
      const url = generatePaymeLink(numericAmount, userId);
      window.open(url, '_blank');
  };

  const handleClickClick = () => {
      const url = generateClickLink(numericAmount, userId);
      window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Checkout</h3>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">{planName} • {amount} UZS</p>
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
               <p className="text-gray-500">Your Pro subscription is active.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Method Toggle */}
              <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button 
                    onClick={() => setActiveMethod('auto')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeMethod === 'auto' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Instant Pay
                  </button>
                  <button 
                    onClick={() => setActiveMethod('manual')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeMethod === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                  >
                    Manual Upload
                  </button>
              </div>

              {activeMethod === 'auto' ? (
                  <div className="space-y-4 pt-2">
                      <button 
                        onClick={handlePaymeClick}
                        className="w-full flex items-center justify-between p-4 bg-[#00CCCC]/10 border border-[#00CCCC]/30 rounded-2xl hover:bg-[#00CCCC]/20 transition-all group"
                      >
                          <span className="font-bold text-[#009999] text-lg">Payme</span>
                          <span className="bg-white text-[#009999] px-3 py-1 rounded-lg text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">Auto</span>
                      </button>
                      <button 
                        onClick={handleClickClick}
                        className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl hover:bg-blue-100 transition-all group"
                      >
                          <span className="font-bold text-blue-600 text-lg">Click</span>
                          <span className="bg-white text-blue-600 px-3 py-1 rounded-lg text-xs font-bold shadow-sm group-hover:scale-105 transition-transform">Auto</span>
                      </button>
                      <p className="text-xs text-gray-400 text-center pt-2">
                          Redirects to secure payment page.
                      </p>
                  </div>
              ) : (
                  // MANUAL UPLOAD UI (Existing)
                  <div className="space-y-4">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        previewUrl ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                      }`}
                    >
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                      
                      {previewUrl ? (
                        <img src={previewUrl} alt="Receipt" className="max-h-40 mx-auto rounded-lg shadow-sm" />
                      ) : (
                        <div>
                          <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                          </div>
                          <p className="text-sm text-gray-600 font-bold">Upload Screenshot</p>
                          <p className="text-xs text-gray-400 mt-1">Proof of transfer</p>
                        </div>
                      )}
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center">
                           <span className="mr-2">⚠️</span> {error}
                        </div>
                    )}

                    <button
                        onClick={handleSubmitManual}
                        disabled={isVerifying || !selectedFile}
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {isVerifying ? 'Verifying...' : 'Verify Receipt'}
                    </button>
                  </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
