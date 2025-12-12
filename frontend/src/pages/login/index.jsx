import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Key, Shield, User, Mail, Building2 } from 'lucide-react';
import { useSession } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import { institutes, getInstituteDisplayText } from '../../data/institutes';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, status } = useSession();

  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      const from = location.state?.from?.pathname || '/intelligent-dashboard';
      navigate(from, { replace: true });
    }
  }, [status, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        role: selectedRole,
        institute: selectedInstitute || undefined,
      });

      if (result.success) {
        // Mark that user has logged in (for returning users)
        // Only set if not a new user (new users will have show_tutorial flag)
        const isNewUser = localStorage.getItem(`is_new_user_${email}`);
        if (!isNewUser) {
          localStorage.setItem(`has_logged_in_${email}`, 'true');
        }

        // Redirect based on role
        const from = location.state?.from?.pathname || '/intelligent-dashboard';
        navigate(from, { replace: true });
      } else {
        setError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        email,
        password,
        name,
        role: selectedRole,
        institute: selectedInstitute || undefined,
      });

      if (response.data.success) {
        // Mark as new user - tutorial will show on first login
        localStorage.setItem(`show_tutorial_${email}`, 'true');
        localStorage.setItem(`is_new_user_${email}`, 'true');

        // Auto-login after signup
        const result = await signIn('credentials', {
          email,
          password,
          role: selectedRole,
        });

        if (result.success) {
          const from = location.state?.from?.pathname || '/intelligent-dashboard';
          navigate(from, { replace: true });
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.error?.message ||
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };



  return (
    <div
      className="min-h-screen bg-[rgb(244,227,187)] flex items-center justify-center p-4 sm:p-6 md:p-8"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.03) 0%, transparent 40%),
                      radial-gradient(circle at 80% 80%, rgba(139, 69, 19, 0.03) 0%, transparent 40%)`
      }}
    >
      <div className="w-full max-w-6xl bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden" style={{
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)'
      }}>
        <div className="flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px]">
          {/* Left Panel - Branding */}
          <div className="w-full lg:w-1/2 relative overflow-hidden p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between order-2 lg:order-1" style={{
            backgroundColor: 'rgb(255, 192, 103)',
            background: 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 50%, rgb(255, 170, 80) 100%)'
          }}>
            {/* Subtle leaf pattern background */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10 Q30 30 20 50 Q30 70 50 90 Q70 70 80 50 Q70 30 50 10' fill='none' stroke='%23000' stroke-width='2'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px'
            }}></div>

            {/* Logo */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 sm:mb-8">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-10 sm:h-10">
                  {/* Main leaf */}
                  <path d="M20 8 Q12 16 10 24 Q8 32 14 36 Q20 40 20 40 Q20 40 26 36 Q32 32 30 24 Q28 16 20 8 Z" fill="#a8d5a8" stroke="#8b6f47" strokeWidth="1.5" />
                  {/* Small nested leaves */}
                  <circle cx="14" cy="18" r="4" fill="#8b6f47" opacity="0.7" />
                  <circle cx="20" cy="16" r="3" fill="#8b6f47" opacity="0.7" />
                  <circle cx="26" cy="18" r="4" fill="#8b6f47" opacity="0.7" />
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 sm:mb-3 text-center lg:text-left tracking-tight leading-tight">
                Ayutra
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 italic text-center lg:text-left mb-6 sm:mb-8 lg:mb-10">
                Bridging Science and Ayurvedic Wisdom
              </p>
            </div>

            {/* Central Visual - Leaf with Circuit Traces */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-4 sm:my-6 lg:my-8">
              <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md h-64 sm:h-72 lg:h-80">
                {/* Central Leaf */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <svg width="120" height="120" viewBox="0 0 140 140" className="mx-auto sm:w-32 sm:h-32 lg:w-36 lg:h-36">
                    <path d="M70 15 Q45 40 38 65 Q30 90 45 105 Q60 120 70 130 Q80 120 95 105 Q110 90 102 65 Q95 40 70 15 Z"
                      fill="#a8d5a8" stroke="#7fb87f" strokeWidth="2" />
                    {/* Veins */}
                    <path d="M70 15 L70 130" stroke="#7fb87f" strokeWidth="1.5" opacity="0.7" />
                    <path d="M55 35 Q70 45 70 60" stroke="#7fb87f" strokeWidth="1" opacity="0.6" fill="none" />
                    <path d="M85 35 Q70 45 70 60" stroke="#7fb87f" strokeWidth="1" opacity="0.6" fill="none" />
                    <path d="M50 70 Q70 60 70 80" stroke="#7fb87f" strokeWidth="1" opacity="0.6" fill="none" />
                    <path d="M90 70 Q70 60 70 80" stroke="#7fb87f" strokeWidth="1" opacity="0.6" fill="none" />
                    <path d="M48 95 Q70 85 70 105" stroke="#7fb87f" strokeWidth="1" opacity="0.6" fill="none" />
                    <path d="M92 95 Q70 85 70 105" stroke="#7fb87f" strokeWidth="1" opacity="0.6" fill="none" />
                  </svg>
                </div>

                {/* Circuit board traces with glowing dots */}
                <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet">
                  {/* Top Left Trace */}
                  <path d="M200 200 L80 80" stroke="#a8d5a8" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <circle cx="80" cy="80" r="5" fill="#ffa500" opacity="0.9" className="animate-pulse" />
                  <circle cx="140" cy="140" r="3.5" fill="#ffa500" opacity="0.7" />

                  {/* Top Right Trace */}
                  <path d="M200 200 L320 80" stroke="#a8d5a8" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <circle cx="320" cy="80" r="5" fill="#ffa500" opacity="0.9" className="animate-pulse" />
                  <circle cx="260" cy="140" r="3.5" fill="#ffa500" opacity="0.7" />

                  {/* Bottom Left Trace */}
                  <path d="M200 200 L80 320" stroke="#a8d5a8" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <circle cx="80" cy="320" r="5" fill="#ffa500" opacity="0.9" className="animate-pulse" />
                  <circle cx="140" cy="260" r="3.5" fill="#ffa500" opacity="0.7" />

                  {/* Bottom Right Trace */}
                  <path d="M200 200 L320 320" stroke="#a8d5a8" strokeWidth="2.5" fill="none" opacity="0.7" />
                  <circle cx="320" cy="320" r="5" fill="#ffa500" opacity="0.9" className="animate-pulse" />
                  <circle cx="260" cy="260" r="3.5" fill="#ffa500" opacity="0.7" />
                </svg>

                {/* Ingredient Bowls positioned along traces */}
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#8b6f47] rounded-full flex items-center justify-center shadow-xl border-2 border-[#6b4e2f] z-30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#6b4e2f] rounded-full border border-[#5a3e1f]"></div>
                </div>
                <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#4a7c59] rounded-full flex items-center justify-center shadow-xl border-2 border-[#2e5e31] z-30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#2e5e31] rounded-full border border-[#1e3e21]"></div>
                </div>
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#d4a574] rounded-full flex items-center justify-center shadow-xl border-2 border-[#b8956a] z-30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#b8956a] rounded-full border border-[#9a755a]"></div>
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-[#f4d03f] rounded-full flex items-center justify-center shadow-xl border-2 border-[#d4b82f] z-30">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-[#d4b82f] rounded-full border border-[#b4981f]"></div>
                </div>
              </div>
            </div>

            {/* Ayurvedic Symbols */}
            <div className="relative z-10 flex justify-center gap-3 sm:gap-4 lg:gap-6 mt-2 sm:mt-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-[#a8d5a8]/50 flex items-center justify-center bg-[#a8d5a8]/10">
                <span className="text-[#a8d5a8] text-[8px] sm:text-[9px] lg:text-[10px] font-bold tracking-wide">VATA</span>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-[#a8d5a8]/50 flex items-center justify-center bg-[#a8d5a8]/10">
                <svg width="20" height="20" viewBox="0 0 28 28" fill="none" className="sm:w-6 sm:h-6 lg:w-7 lg:h-7">
                  {/* Triangle with horizontal line */}
                  <path d="M14 6 L22 20 L6 20 Z" stroke="#a8d5a8" strokeWidth="2" fill="none" />
                  <path d="M8 14 L20 14" stroke="#a8d5a8" strokeWidth="2" />
                </svg>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full border-2 border-[#a8d5a8]/50 flex items-center justify-center bg-[#a8d5a8]/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5 lg:w-6 lg:h-6">
                  {/* Trident-like symbol */}
                  <path d="M12 4 L12 20 M4 12 L20 12 M8 8 L16 16" stroke="#a8d5a8" strokeWidth="2.5" />
                </svg>
              </div>
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div
            className="w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between order-1 lg:order-2"
            style={{
              background: 'linear-gradient(135deg,rgb(132, 219, 148) 0%,rgb(186, 218, 190) 25%, #C9EACD 50%, #B7E3BB 75%, #A3D9A5 100%)',
              backgroundImage: `
                radial-gradient(circle at 20% 30%, rgba(140, 207, 138, 0.20) 0%, transparent 55%),
                radial-gradient(circle at 80% 70%, rgba(120, 180, 120, 0.18) 0%, transparent 55%),
                radial-gradient(circle at 50% 50%, rgba(100, 160, 100, 0.12) 0%, transparent 65%),
                linear-gradient(135deg, rgba(163, 217, 165, 0.10) 0%, transparent 100%)
              `,
            }}
          >
            {/* Header */}
            <div className="mb-6 sm:mb-8">
              {/* Toggle between Login and Signup */}
              <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(false);
                    setError('');
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${!isSignup
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-[#5c3e1f] hover:bg-gray-200'
                    }`}
                  style={!isSignup ? {
                    background: 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 100%)',
                    border: 'none'
                  } : {}}
                  onMouseEnter={!isSignup ? (e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(255, 180, 90) 0%, rgb(255, 170, 80) 100%)';
                  } : undefined}
                  onMouseLeave={!isSignup ? (e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 100%)';
                  } : undefined}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup(true);
                    setError('');
                  }}
                  className={`flex-1 py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 ${isSignup
                      ? 'text-white shadow-md'
                      : 'bg-gray-100 text-[#5c3e1f] hover:bg-gray-200'
                    }`}
                  style={isSignup ? {
                    background: 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 100%)',
                    border: 'none'
                  } : {}}
                  onMouseEnter={isSignup ? (e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(255, 180, 90) 0%, rgb(255, 170, 80) 100%)';
                  } : undefined}
                  onMouseLeave={isSignup ? (e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 100%)';
                  } : undefined}
                >
                  Sign Up
                </button>
              </div>

              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <span className="text-[#8b6f47] text-xs sm:text-sm font-medium">
                  {isSignup ? 'Sign up as:' : 'Login as:'}
                </span>
                <Key size={14} className="text-[#d4a574] sm:w-4 sm:h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#5c3e1f] mb-5 sm:mb-6 lg:mb-8 leading-tight">
                {isSignup ? 'Create your account' : 'Login to your account'}
              </h2>

              {/* Role Selection */}
              <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 mb-5 sm:mb-6 lg:mb-8">
                {(isSignup ? ['Patient', 'Practitioner'] : ['Admin', 'Practitioner', 'Patient']).map((role) => (
                  <label key={role} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={selectedRole === role}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-4 h-4 sm:w-[18px] sm:h-[18px] focus:ring-2 cursor-pointer"
                      style={{
                        accentColor: 'rgb(255, 192, 103)'
                      }}
                    />
                    <span className="text-[#5c3e1f] font-medium text-xs sm:text-sm lg:text-base transition-colors whitespace-nowrap" style={{
                      color: selectedRole === role ? 'rgb(255, 192, 103)' : '#5c3e1f'
                    }}>{role}</span>
                  </label>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4 sm:space-y-5 lg:space-y-6">
                {error && (
                  <div className="p-3 sm:p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
                    {error}
                  </div>
                )}

                {/* Name field (only for signup) */}
                {isSignup && (
                  <div className="relative">
                    <User className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={isSignup}
                      disabled={loading}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-gray-200 bg-white text-[#5c3e1f] placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(255, 192, 103)';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 103, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    />
                  </div>
                )}

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-gray-200 bg-white text-[#5c3e1f] placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(255, 192, 103)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 103, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-gray-200 bg-white text-[#5c3e1f] placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgb(255, 192, 103)';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 103, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  />
                </div>

                {/* Confirm Password (only for signup) */}
                {isSignup && (
                  <div className="relative">
                    <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required={isSignup}
                      disabled={loading}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-gray-200 bg-white text-[#5c3e1f] placeholder:text-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(255, 192, 103)';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 103, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    />
                  </div>
                )}

                {/* Institute Selection - Only for Practitioners and Admins */}
                {(selectedRole === 'Practitioner' || selectedRole === 'Admin') && (
                  <div className="relative">
                    <Building2 className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      value={selectedInstitute}
                      onChange={(e) => setSelectedInstitute(e.target.value)}
                      disabled={loading}
                      className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 rounded-lg border border-gray-200 bg-white text-[#5c3e1f] text-sm sm:text-base focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all appearance-none cursor-pointer"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M6 9L1 4h10z' fill='%235c3e1f'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        paddingRight: '2.5rem'
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = 'rgb(255, 192, 103)';
                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(255, 192, 103, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '';
                        e.currentTarget.style.boxShadow = '';
                      }}
                    >
                      <option value="">Select Institute (Optional)</option>
                      {institutes.map((institute, index) => (
                        <option key={`${institute.code}-${institute.place}-${index}`} value={`${institute.code}-${institute.place}`}>
                          {getInstituteDisplayText(institute)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 sm:py-4 rounded-lg text-white font-bold uppercase tracking-wider text-xs sm:text-sm shadow-lg transition-all duration-200 hover:shadow-xl hover:opacity-95 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 50%, rgb(255, 170, 80) 100%)',
                    border: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(255, 180, 90) 0%, rgb(255, 170, 80) 50%, rgb(255, 160, 70) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgb(255, 192, 103) 0%, rgb(255, 180, 90) 50%, rgb(255, 170, 80) 100%)';
                  }}
                >
                  {loading
                    ? (isSignup ? 'CREATING ACCOUNT...' : 'LOGGING IN...')
                    : (isSignup ? 'SIGN UP' : 'LOG IN')
                  }
                </button>
              </form>

              {/* Social Login/Signup Buttons */}


              {/* Signup helper text */}
              {isSignup && (
                <div className="mt-4 sm:mt-5 text-center text-xs sm:text-sm text-[#8b6f47]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignup(false);
                      setError('');
                    }}
                    className="font-medium hover:underline transition-colors"
                    style={{ color: 'rgb(255, 192, 103)' }}
                  >
                    Login here
                  </button>
                </div>
              )}
            </div>

            {/* Footer Links */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 text-xs sm:text-sm text-[#8b6f47] mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/50">
              <a href="#" className="hover:text-[#5c3e1f] transition-colors">Privacy Policy</a>
              <div className="flex items-center gap-2">
                <Shield size={12} className="sm:w-3.5 sm:h-3.5" />
                <span>End-to-end encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
