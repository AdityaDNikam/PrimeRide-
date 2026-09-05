import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const UserLogni = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      const jsonPayload = JSON.stringify(payload, null, 2);

      // Console log the data in JSON format
      console.log('%c[PrimeRide Login] User Data JSON Output:', 'color: #38bdf8; font-weight: bold; font-size: 14px;');
      console.log(jsonPayload);
      console.log('%c[Parsed Object]:', 'color: #a7f3d0; font-weight: bold;', payload);

      setShowSuccessModal(true);
    } else {
      setShowSuccessModal(false);
    }
  };

  const handleQuickFill = () => {
    setFormData({
      username: 'alex_rider',
      email: 'alex.rider@primeride.com',
      password: 'SecurePassword123!',
    });
    setErrors({ username: '', email: '', password: '' });
  };

  return (
    <div className="h-full w-full flex flex-col justify-between bg-black select-none overflow-y-auto font-['Outfit',sans-serif] relative">
      {/* Header Container */}
      <div className="w-full pt-6 px-6 flex items-center justify-between z-10">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 text-sm font-medium bg-neutral-900/60 px-3 py-1.5 rounded-full border border-neutral-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>
        <span className="text-xl font-extrabold tracking-tight text-[#2b14be]">
          PrimeRide
        </span>
      </div>

      {/* Main Login Card Section */}
      <div className="flex-1 flex flex-col justify-center px-6 py-6 max-w-sm w-full mx-auto z-10">
        <div className="mb-6">
          <h2 className="text-white text-3xl font-bold tracking-tight">Welcome Back</h2>
          <p className="text-neutral-400 text-sm mt-1">
            Sign in to continue your seamless journey.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Username Input Field */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="username" className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Username <span className="text-red-500">*</span>
              </label>
              {/* Error Popup Right Above Input Field */}
              {errors.username && (
                <span className="text-xs text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. john_doe"
                className={`w-full pl-10 pr-4 py-3 bg-neutral-900/90 text-white rounded-xl border text-sm outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.username
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-[#2b14be] focus:ring-2 focus:ring-[#2b14be]/30'
                }`}
              />
            </div>
          </div>

          {/* Email Input Field */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="email" className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Email Address <span className="text-red-500">*</span>
              </label>
              {/* Error Popup Right Above Input Field */}
              {errors.email && (
                <span className="text-xs text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className={`w-full pl-10 pr-4 py-3 bg-neutral-900/90 text-white rounded-xl border text-sm outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.email
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-[#2b14be] focus:ring-2 focus:ring-[#2b14be]/30'
                }`}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              {/* Error Popup Right Above Input Field */}
              {errors.password && (
                <span className="text-xs text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-500/40">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className={`w-full pl-10 pr-10 py-3 bg-neutral-900/90 text-white rounded-xl border text-sm outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.password
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-[#2b14be] focus:ring-2 focus:ring-[#2b14be]/30'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.02 10.02 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Helper utilities: Demo autofill link */}
          <div className="flex justify-between items-center text-xs pt-1">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-neutral-400 hover:text-[#38bdf8] underline decoration-dotted transition-colors"
            >
              Autofill test data
            </button>
            <span className="text-neutral-500">All fields required</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#1c129e] hover:bg-[#2317c4] text-white text-base font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#1c129e]/30 flex items-center justify-center gap-2 border border-blue-600/30"
          >
            <span>Login</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      {/* Login Success Pop Up Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xs rounded-2xl p-6 text-center shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
              <svg className="w-7 h-7 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-1">
              Login Success Full!
            </h3>
            <p className="text-neutral-400 text-xs mb-6">
              Welcome back, <span className="text-white font-medium">{formData.username}</span>! Data has been logged to console.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-[#1c129e] hover:bg-[#2317c4] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-[#1c129e]/30"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation Switch */}
      <div className="w-full pb-6 px-6 text-center text-xs text-neutral-500 z-10 flex flex-col gap-1.5">
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#38bdf8] font-medium hover:underline">
            Sign Up
          </Link>
        </p>
        <p>
          Are you a driver?{' '}
          <Link to="/captain-login" className="text-amber-400 font-medium hover:underline">
            Captain Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogni;
