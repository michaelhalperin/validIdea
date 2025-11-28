import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      refreshUser().then((user) => {
        // OAuth users are auto-verified, but check just in case
        if (user && !user.isVerified && !user.googleId) {
          navigate('/verify-email');
        } else {
          navigate('/history');
        }
      });
    } else {
      navigate('/login?error=oauth_failed');
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 animate-spin text-primary-500 mb-4" />
      <p className="text-gray-400 animate-pulse">Completing authentication...</p>
    </div>
  );
}
