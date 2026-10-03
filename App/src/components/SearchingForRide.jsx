import React, { useState, useEffect } from 'react';
import defaultDriverAvatar from '../assets/driver_avatar.png';
import uberGoImg from '../assets/uber_go.png';
import uberMotoImg from '../assets/uber_moto.png';
import uberAutoImg from '../assets/uber_auto.png';

const SearchingForRide = ({
  pickup = 'Current Location',
  destination = '',
  selectedRide = null,
  driver = null,
  searchDuration = 10, // 10 seconds load requirement
  onCancelSearch,
  onDriverFound
}) => {
  const [isSearching, setIsSearching] = useState(true);
  const [countdown, setCountdown] = useState(searchDuration);
  const [message, setMessage] = useState('');
  const [sentMessages, setSentMessages] = useState([]);

  // Fallback / default driver details if not provided via props (fully prop driven!)
  const rideOption = selectedRide?.name || 'UberGo';
  const defaultVehicleImg = selectedRide?.image || uberGoImg;

  const driverData = {
    name: driver?.name || driver?.driverName || 'SANTH',
    carNumber: driver?.carNumber || driver?.vehicleNumber || 'KA15AK00-0',
    vehicleModel: driver?.vehicleModel || driver?.carModel || 'White Suzuki S-Presso LXI',
    phoneNumber: driver?.phoneNumber || driver?.driverNumber || '+91 98765 43210',
    rating: driver?.rating || '4.9',
    avatar: driver?.avatar || driver?.driverImage || defaultDriverAvatar,
    vehicleImage: driver?.vehicleImage || defaultVehicleImg,
    otp: driver?.otp || '4829'
  };

  // 10-Second Timer Effect
  useEffect(() => {
    if (!isSearching) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsSearching(false);
          if (onDriverFound) {
            onDriverFound(driverData);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSearching]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setSentMessages((prev) => [...prev, message.trim()]);
      setMessage('');
    }
  };

  const handleCallDriver = () => {
    window.location.href = `tel:${driverData.phoneNumber}`;
  };

  return (
    <div className="relative fixed left-0 right-0 bottom-0 z-40 bg-[#121da6] rounded-t-[32px] shadow-[0_-12px_45px_rgba(18,29,166,0.4)] transition-all duration-500 flex flex-col font-['Outfit',sans-serif] animate-fadeIn select-none">
      {/* Dynamic Header Handle */}
      <div className="w-full pt-3 pb-2 flex flex-col items-center justify-center">
        <div className="w-12 h-1.5 bg-white/40 rounded-full" />
      </div>

      {/* Main Content Area */}
      <div className="px-5 pb-6 flex flex-col gap-4">
        {/* ================= STATE 1: SEARCHING / LOADING FOR 10 SECONDS ================= */}
        {isSearching ? (
          <div className="bg-white rounded-2xl p-6 shadow-xl border border-white/40 flex flex-col items-center text-center relative overflow-hidden animate-fadeIn">
            {/* Animated Glowing Loading Radar / Rings */}
            <div className="relative w-24 h-24 my-2 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#121da6]/20 animate-ping opacity-75" />
              <div className="absolute inset-2 rounded-full bg-[#121da6]/30 animate-pulse" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#121da6] animate-spin" style={{ animationDuration: '4s' }} />

              {/* Center Vehicle Image / Icon */}
              <div className="relative z-10 w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center shadow-md p-1 border border-neutral-200">
                {driverData.vehicleImage ? (
                  <img src={driverData.vehicleImage} alt={rideOption} className="max-h-full max-w-full object-contain filter drop-shadow-sm" />
                ) : (
                  <svg className="w-8 h-8 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Loading Title */}
            <h2 className="text-2xl font-black text-black tracking-tight mt-1">
              Looking for rides...
            </h2>

            {/* Timer Sentence */}
            <p className="text-sm font-semibold text-neutral-600 mt-2 bg-neutral-100 px-4 py-1.5 rounded-full border border-neutral-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#121da6] animate-ping" />
              <span className="text-[#121da6] font-extrabold">{countdown}s</span> required to assign nearby driver
            </p>

            {/* Route & Ride Summary */}
            <div className="w-full mt-4 p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-left flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-black">{rideOption}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">Connecting</span>
                </div>
                <p className="text-xs text-neutral-500 font-medium truncate mt-0.5">
                  {pickup} ➔ {destination || 'Destination'}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-base font-black text-black">{selectedRide?.price || '₹193.20'}</p>
              </div>
            </div>

            {/* Cancel Button in Loading State */}
            <button
              type="button"
              onClick={onCancelSearch}
              className="w-full mt-4 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white font-bold text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 tracking-wide transition-all cursor-pointer border border-red-500"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel Search</span>
            </button>
          </div>
        ) : (
          /* ================= STATE 2: DRIVER ASSIGNED CARD (MATCHING ATTACHED SCREENSHOT EXACTLY) ================= */
          <div className="bg-white rounded-2xl p-5 shadow-2xl border border-white/40 flex flex-col gap-4 animate-fadeIn">

            {/* Top Row: Driver Avatar & Vehicle Image (Left) + Driver Name, Car Number, Vehicle Details & Rating (Right) */}
            <div className="flex items-start justify-between">

              {/* Left Side: Overlapping Driver Profile Photo + Vehicle Image */}
              <div className="relative flex items-center pt-1 pl-1">
                {/* Driver Circular Profile Photo */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-neutral-100 shadow-md bg-neutral-200 shrink-0 z-10">
                  <img
                    src={driverData.avatar}
                    alt={driverData.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Overlapping Vehicle Image */}
                <div className="w-20 h-14 -ml-6 z-20 shrink-0 flex items-center justify-center">
                  <img
                    src={driverData.vehicleImage}
                    alt={driverData.vehicleModel}
                    className="max-h-full max-w-full object-contain filter drop-shadow-md"
                  />
                </div>
              </div>

              {/* Right Side: Driver Name, Car Number, Vehicle Model & Rating */}
              <div className="text-right flex flex-col items-end pl-2">
                {/* Driver Name (ALL CAPS) */}
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {driverData.name}
                </span>

                {/* Car Number (Large Bold Text) */}
                <h3 className="text-2xl font-black text-black tracking-tight mt-0.5 leading-none">
                  {driverData.carNumber}
                </h3>

                {/* Vehicle Model / Color */}
                <p className="text-xs font-medium text-neutral-600 mt-1">
                  {driverData.vehicleModel}
                </p>

                {/* Star Rating */}
                <div className="flex items-center gap-1 mt-1 text-neutral-900 font-extrabold text-sm">
                  <svg className="w-4 h-4 fill-black" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span>{driverData.rating}</span>
                </div>
              </div>

            </div>

            {/* OTP Banner / Status */}
            <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 px-4 py-2.5 rounded-xl">
              <span className="text-xs font-semibold text-neutral-600">PIN for Driver</span>
              <span className="text-base font-black tracking-widest text-[#121da6] bg-[#121da6]/10 px-3 py-0.5 rounded-lg border border-[#121da6]/20">
                {driverData.otp}
              </span>
            </div>

            {/* Middle Section: "Send a message..." Input Bar */}
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Send a message..."
                className="w-full bg-[#f2f4f7] hover:bg-[#eaecef] focus:bg-white text-black placeholder:text-neutral-500 font-semibold text-sm px-4 py-3 rounded-2xl border border-transparent focus:border-neutral-300 focus:outline-none transition-all pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 p-1.5 text-neutral-600 hover:text-black transition-colors cursor-pointer"
                title="Send message"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>

            {/* Sent messages preview list */}
            {sentMessages.length > 0 && (
              <div className="flex flex-col gap-1 max-h-20 overflow-y-auto px-1">
                {sentMessages.map((msg, idx) => (
                  <div key={idx} className="self-end bg-[#121da6] text-white text-xs font-medium px-3 py-1.5 rounded-xl max-w-[85%] truncate">
                    {msg}
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Row: 3 Action Circular Buttons (Safety, Share my trip, Call driver) */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-100">

              {/* Action 1: Safety */}
              <button
                type="button"
                onClick={() => alert("Safety toolkit active. Emergency features ready.")}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#f2f4f7] group-hover:bg-neutral-200 active:scale-95 flex items-center justify-center transition-all shadow-sm">
                  <svg className="w-6 h-6 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-black tracking-tight">
                  Safety
                </span>
              </button>

              {/* Action 2: Share my trip */}
              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: 'My Ride Trip', text: `Riding with ${driverData.name} (${driverData.carNumber})`, url: window.location.href });
                  } else {
                    alert(`Trip link copied! Share with friends: Riding with ${driverData.name} in ${driverData.carNumber}`);
                  }
                }}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#f2f4f7] group-hover:bg-neutral-200 active:scale-95 flex items-center justify-center transition-all shadow-sm">
                  <svg className="w-6 h-6 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="2" fill="currentColor" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-black tracking-tight">
                  Share my trip
                </span>
              </button>

              {/* Action 3: Call driver */}
              <button
                type="button"
                onClick={handleCallDriver}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
              >
                <div className="w-14 h-14 rounded-full bg-[#f2f4f7] group-hover:bg-neutral-200 active:scale-95 flex items-center justify-center transition-all shadow-sm">
                  <svg className="w-6 h-6 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-black tracking-tight">
                  Call driver
                </span>
              </button>

            </div>

            {/* Cancel Trip Option */}
            <div className="pt-1">
              <button
                type="button"
                onClick={onCancelSearch}
                className="w-full bg-neutral-100 hover:bg-neutral-200 active:scale-[0.98] text-neutral-800 font-bold text-sm py-2.5 px-4 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
              >
                <span>Cancel Trip</span>
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default SearchingForRide;
