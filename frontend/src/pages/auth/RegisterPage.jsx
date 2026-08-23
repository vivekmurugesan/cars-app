import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const INTERESTS = [
  { id: 'LEARN_ABOUT_CARS', label: '🚗 Learn About Cars' },
  { id: 'DIFFERENT_BRANDS', label: '🏢 Different Brands' },
  { id: 'CAR_CONCEPTS', label: '💡 Car Concepts' },
  { id: 'AUTOMOBILE_HISTORY', label: '📚 Automobile History' },
  { id: 'LATEST_RELEASES', label: '✨ Latest Releases' },
  { id: 'PERFORMANCE_SPECS', label: '⚡ Performance Specs' },
];

const RegisterPage = () => {
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [interests, setInterests] = useState([]);
  const navigate = useNavigate();
  const { register, sendOtp, isLoading } = useAuthStore();

  useEffect(() => {
    console.log('RegisterPage step changed to:', step);
  }, [step]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    console.log('handleEmailSubmit called, current step:', step);
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    const success = await sendOtp(email);
    console.log('sendOtp result:', success);
    if (success) {
      console.log('Setting step to interests');
      toast.success('OTP sent to your email!');
      setStep('interests');
    } else {
      toast.error('Failed to send OTP');
    }
  };

  const toggleInterest = (interestId) => {
    setInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (interests.length === 0) {
      toast.error('Please select at least one interest');
      return;
    }
    const success = await register(email, interests);
    if (success) {
      toast.success('Registration successful!');
      navigate('/');
    } else {
      toast.error('Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🏎️ Cars App</h1>
            <p className="text-gray-600">Join us to explore amazing cars!</p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Sending...' : 'Continue'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What are you interested in?
                </label>
                <div className="space-y-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                        interests.includes(interest.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="font-medium">{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || interests.length === 0}
                className="btn btn-primary w-full"
              >
                {isLoading ? 'Registering...' : 'Complete Registration'}
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
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
