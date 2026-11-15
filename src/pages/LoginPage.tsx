import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const regSuccessMsg = (location.state as any)?.registeredSuccess;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await login({ email, password });
      if (loggedUser.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] relative flex flex-col justify-center items-center py-12 px-4 sm:px-6">
      
      {/* Background with warm golden temple overlay matching Reference 2 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/temple_hero_gopuram.jpg"
          alt="Temple Background"
          className="w-full h-full object-cover object-center filter blur-xs brightness-75 scale-105"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/temple_cover_banner.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#241816]/75 via-[#241816]/65 to-[#241816]/85"></div>
      </div>

      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Brand Lockup */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white font-bold text-2xl font-temple-heading">
            <div className="w-8 h-8 rounded-lg bg-[#E87325] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2L9 6H15L12 2Z" />
                <path d="M7 7L5 10H19L17 7H7Z" />
                <path d="M4 11L2 14H22L20 11H4Z" />
                <path d="M4 15V22H8V17H16V22H20V15H4Z" />
              </svg>
            </div>
            <span>Temple Ease</span>
          </Link>
        </div>

        {/* Floating Login Card matching Reference 2 */}
        <div className="bg-white rounded-3xl p-7 sm:p-8 shadow-2xl space-y-5 border border-white/20">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold font-temple-heading text-[#3A1412]">
              Welcome Back
            </h1>
            <p className="text-xs text-stone-500">
              Login to access your account
            </p>
          </div>

          {regSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{regSuccessMsg}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325] text-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl focus:outline-hidden focus:border-[#E87325] text-stone-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#E87325] focus:ring-[#E87325]"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-stone-500 hover:text-[#E87325] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Orange Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Alternate options matching Reference 2 */}
          <div className="space-y-3 pt-2 text-center">
            <span className="text-[11px] text-stone-400 uppercase tracking-widest block font-medium">
              Or
            </span>

            <Link
              to="/register"
              className="w-full py-2.5 bg-white hover:bg-[#FAF7F2] border border-[#E5DCCE] text-stone-700 text-xs font-semibold rounded-xl flex items-center justify-center transition-colors block"
            >
              Create an Account
            </Link>

            <Link
              to="/"
              className="text-xs text-stone-500 hover:text-[#E87325] transition-colors inline-block pt-1"
            >
              Continue as Guest
            </Link>
          </div>

        </div>

        {/* Bottom Tagline matching Reference 2 */}
        <p className="text-center text-xs text-stone-300 font-medium tracking-wide">
          Your Temple Guide · Safe · Simple · Accessible
        </p>

      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 border border-[#E5DCCE] shadow-xl text-center">
            <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
              Password Recovery
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Please contact the temple helpdesk at <strong>helpdesk@templeease.org</strong> or call <strong>0877-2263000</strong> to reset your password.
            </p>
            <button
              onClick={() => setForgotModalOpen(false)}
              className="w-full py-2 bg-[#E87325] text-white text-xs font-semibold rounded-xl"
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
