import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CaptionSignin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
    password: '',
    registrationNum: '',
    color: '',
    capacity: '',
    vehicleType: '',
  });

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
    password: '',
    registrationNum: '',
    color: '',
    capacity: '',
    vehicleType: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const vehicleOptions = [
    { value: '', label: 'Select Vehicle Type' },
    { value: 'bike', label: 'Bike' },
    { value: 'car', label: 'Car' },
    { value: 'auto', label: 'Auto' },
  ];

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

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name is required';
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name is required';
    }

    // Email Id validation
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email Id is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.emailId)) {
      newErrors.emailId = 'Invalid email format';
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone Number is required';
    } else if (!/^\+?[0-9]{7,15}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Registration Number validation
    if (!formData.registrationNum.trim()) {
      newErrors.registrationNum = 'Registration Num is required';
    }

    // Color validation
    if (!formData.color.trim()) {
      newErrors.color = 'Color is required';
    }

    // Capacity validation
    if (!formData.capacity.toString().trim()) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || Number(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be positive number';
    }

    // Vehicle Type validation
    if (!formData.vehicleType) {
      newErrors.vehicleType = 'Select Vehicle Type';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const payload = {
        FirstName: formData.firstName.trim(),
        LastName: formData.lastName.trim(),
        EmailId: formData.emailId.trim(),
        PhoneNumber: formData.phoneNumber.trim(),
        Password: formData.password,
        Regrestration_Num: formData.registrationNum.trim(),
        Color: formData.color.trim(),
        Capacity: Number(formData.capacity),
        VehicleType: formData.vehicleType,
      };

      const jsonPayload = JSON.stringify(payload, null, 2);

      // Console log the Captain Input in JSON format as required
      console.log('%c[PrimeRide Captain SignUp] Data JSON Output:', 'color: #f59e0b; font-weight: bold; font-size: 14px;');
      console.log(jsonPayload);
      console.log('%c[Parsed Captain Object]:', 'color: #fcd34d; font-weight: bold;', payload);

      setShowSuccessModal(true);
    } else {
      setShowSuccessModal(false);
    }
  };

  const handleRedirectToCaptainLogin = () => {
    setShowSuccessModal(false);
    navigate('/captain-login');
  };

  const handleQuickFill = () => {
    setFormData({
      firstName: 'Jack',
      lastName: 'Sparrow',
      emailId: 'jack.sparrow@primeride.com',
      phoneNumber: '+19876543210',
      password: 'CaptainPassword2026!',
      registrationNum: 'MH-12-AB-3456',
      color: 'Midnight Black',
      capacity: '4',
      vehicleType: 'car',
    });
    setErrors({
      firstName: '',
      lastName: '',
      emailId: '',
      phoneNumber: '',
      password: '',
      registrationNum: '',
      color: '',
      capacity: '',
      vehicleType: '',
    });
  };

  return (
    <div className="h-full w-full flex flex-col justify-between bg-black select-none overflow-y-auto font-['Outfit',sans-serif] relative">
      {/* Top Bar Header */}
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
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-[#2b14be]">
            PrimeRide
          </span>
          <span className="bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-amber-500/30">
            Captain
          </span>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="flex-1 flex flex-col justify-center px-6 py-4 max-w-sm w-full mx-auto z-10 my-2">
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 bg-neutral-900/90 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20 mb-2">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Captain Onboarding
          </div>
          <h2 className="text-white text-2xl font-bold tracking-tight">Become a Captain</h2>
          <p className="text-neutral-400 text-xs mt-0.5">
            Register your vehicle details and start earning today.
          </p>
        </div>

        {/* SignUp Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-3">
          {/* Section 1: Personal Details */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-1 flex items-center gap-1.5">
            <span>1. Personal Information</span>
          </div>

          {/* Name Row: First Name & Last Name */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* First Name */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="firstName" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  First Name <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.firstName && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.firstName}
                </span>
              )}
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.firstName
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="lastName" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Last Name <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.lastName && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.lastName}
                </span>
              )}
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.lastName
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>
          </div>

          {/* Email Id & Phone Number Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Email Id */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="emailId" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Email Id <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.emailId && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.emailId}
                </span>
              )}
              <input
                id="emailId"
                name="emailId"
                type="email"
                value={formData.emailId}
                onChange={handleChange}
                placeholder="email@example.com"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.emailId
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="phoneNumber" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Phone Number <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.phoneNumber && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.phoneNumber}
                </span>
              )}
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 234 567 8900"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.phoneNumber
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-0.5">
              <label htmlFor="password" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                Password <span className="text-red-500">*</span>
              </label>
              {errors.password && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40">
                  {errors.password}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••••"
                className={`w-full px-3 py-2 pr-10 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.password
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.02 10.02 0 013.682-.863c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Section 2: Vehicle Details */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-400 border-b border-neutral-800 pb-1 flex items-center gap-1.5 pt-1">
            <span>2. Vehicle Specification</span>
          </div>

          {/* Vehicle Type Dropdown & Registration Num */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* VehicleType Dropdown */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="vehicleType" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.vehicleType && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.vehicleType}
                </span>
              )}
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 ${
                  errors.vehicleType
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              >
                {vehicleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-neutral-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Registration Num */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="registrationNum" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Reg Num <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.registrationNum && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.registrationNum}
                </span>
              )}
              <input
                id="registrationNum"
                name="registrationNum"
                type="text"
                value={formData.registrationNum}
                onChange={handleChange}
                placeholder="e.g. MH-12-AB-3456"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.registrationNum
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>
          </div>

          {/* Color & Capacity Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Color */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="color" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Color <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.color && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.color}
                </span>
              )}
              <input
                id="color"
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Black / White"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.color
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>

            {/* Capacity */}
            <div className="flex flex-col">
              <div className="flex justify-between items-center mb-0.5">
                <label htmlFor="capacity" className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider">
                  Capacity <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.capacity && (
                <span className="text-[10px] text-red-400 font-semibold flex items-center gap-1 animate-pulse bg-red-950/60 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40 mb-1">
                  {errors.capacity}
                </span>
              )}
              <input
                id="capacity"
                name="capacity"
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="Seats (e.g. 4)"
                className={`w-full px-3 py-2 bg-neutral-900/90 text-white rounded-xl border text-xs outline-none transition-all duration-200 placeholder:text-neutral-500 ${
                  errors.capacity
                    ? 'border-red-500/80 focus:border-red-400 focus:ring-2 focus:ring-red-500/20'
                    : 'border-neutral-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
            </div>
          </div>

          {/* Quick autofill helper */}
          <div className="flex justify-between items-center text-xs pt-1">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-neutral-400 hover:text-amber-400 underline decoration-dotted transition-colors"
            >
              Autofill captain data
            </button>
            <span className="text-neutral-500">All fields required</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-[#1c129e] hover:bg-[#2317c4] text-white text-base font-semibold py-3 px-6 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-lg shadow-[#1c129e]/30 flex items-center justify-center gap-2 border border-blue-600/30"
          >
            <span>Register as Captain</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>

      {/* SignUp Success Pop Up Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-neutral-900 border border-neutral-800 w-full max-w-xs rounded-2xl p-6 text-center shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
              <svg className="w-7 h-7 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-1">
              SignUp Successful
            </h3>
            <p className="text-neutral-400 text-xs mb-6">
              Welcome Captain <span className="text-white font-medium">{formData.firstName}</span>! Your vehicle registration is complete. Redirecting to Captain Login...
            </p>
            <button
              onClick={handleRedirectToCaptainLogin}
              className="w-full bg-[#1c129e] hover:bg-[#2317c4] text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 active:scale-95 shadow-lg shadow-[#1c129e]/30 flex items-center justify-center gap-1.5"
            >
              <span>Go to Captain Login</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Footer Navigation Switch */}
      <div className="w-full pb-5 px-6 text-center text-xs text-neutral-500 z-10">
        <p>
          Already registered as a Captain?{' '}
          <Link to="/captain-login" className="text-amber-400 font-medium hover:underline">
            Captain Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CaptionSignin;

