import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const LoginPage = () => {
  const [step, setStep] = useState('email'); // email or otp
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [buttonLoading, setButtonLoading] = useState(false);
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuthStore();

  useEffect(() => {
    console.log('Step changed to:', step);
  }, [step]);


  const handleSendOtp = async (e) => {
    e.preventDefault();
    console.log('handleSendOtp called, current step:', step);
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setButtonLoading(true);
    const success = await sendOtp(email);
    setButtonLoading(false);
    console.log('sendOtp result:', success);
    if (success) {
      console.log('Setting step to otp');
      toast.success('OTP sent to your email!');
      setStep('otp');
      console.log('After setStep, step should be otp');
    } else {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      toast.error('Please enter the OTP');
      return;
    }
    setButtonLoading(true);
    const success = await verifyOtp(email, otp);
    setButtonLoading(false);
    if (success) {
      toast.success('Login successful!');
      navigate('/');
    } else {
      toast.error('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏎️ Cars App</h1>
            <p className="text-gray-600">Learn about your favorite cars</p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="input-field"
                  disabled={buttonLoading}
                />
              </div>

              <button
                type="submit"
                disabled={buttonLoading}
                className="btn btn-primary w-full"
              >
                {buttonLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="000000"
                  maxLength="6"
                  className="input-field text-center text-2xl tracking-widest"
                  disabled={buttonLoading}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Check your email for the OTP code
                </p>
              </div>

              <button
                type="submit"
                disabled={buttonLoading}
                className="btn btn-primary w-full"
              >
                {buttonLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="btn btn-secondary w-full"
              >
                Back
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
