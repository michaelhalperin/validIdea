import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Mail, ArrowLeft } from 'lucide-react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [error, setError] = useState('');

  useEffect(() => {
    // If user is already verified, redirect to dashboard
    if (user?.isVerified || user?.googleId) {
      navigate('/history');
      return;
    }

    // If there's a token in URL, verify it
    if (token) {
      verifyToken();
    } else {
      // No token - show pending state
      setStatus('pending');
    }
  }, [token, user]);

  const verifyToken = async () => {
    if (!token) return;
    
    setStatus('loading');
    try {
      await api.post('/auth/verify-email', { token });
      setStatus('success');
      await refreshUser();
      toast.success('Email verified successfully!');
      setTimeout(() => {
        navigate('/history');
      }, 2000);
    } catch (err: any) {
      setStatus('error');
      setError(err.response?.data?.error || 'Verification failed');
    }
  };

  const resendVerification = async () => {
    if (!user?.email) return;
    
    try {
      await api.post('/auth/resend-verification', { email: user.email });
      toast.success('Verification email sent!');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send verification email');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#030303]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center p-8 rounded-2xl bg-[#080808] border border-white/10"
      >
        {status === 'loading' && (
          <>
            <Loader2 className="w-16 h-16 text-[#6366F1] animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
            <p className="text-gray-400">Please wait while we verify your email address.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-8">
              Your email has been successfully verified. Redirecting to dashboard...
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-8">{error}</p>
            <Link to="/login" className="btn-ghost w-full flex items-center justify-center">
              Back to Login
            </Link>
          </>
        )}

        {status === 'pending' && (
          <>
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
            <p className="text-gray-400 mb-6">
              We've sent a verification link to <strong className="text-white">{user?.email}</strong>. 
              Please check your inbox and click the link to verify your email address.
            </p>
            <div className="space-y-3">
              <button
                onClick={resendVerification}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Resend Verification Email
              </button>
              <Link to="/login" className="block text-sm text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4 inline mr-2" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}