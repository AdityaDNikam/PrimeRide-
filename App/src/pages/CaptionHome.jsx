import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaptain } from '../context/CaptainContext';
import axiosInstance from '../services/axios';
import mapBg from '../assets/map_bg.png';

const CaptionHome = ({
  initialActive = false,
  rideData = null,
  onStatusChange,
  onAcceptRide,
  onDeclineRide
}) => {
  const { captain, logoutCaptain } = useCaptain();
  const navigate = useNavigate();

  // Active / In-active Captain status state
  const [isActive, setIsActive] = useState(initialActive);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Incoming Ride Request State (Prop-driven with fallback defaults)
  const defaultRide = {
    id: 'RIDE-8842',
    pickup: 'Abc',
    destination: 'Xyz',
    distance: '13 km',
    duration: '20 mins',
    fare: '163 Rs',
    passengerName: 'Rajesh K.',
    rating: '4.9'
  };

  const currentRide = rideData || defaultRide;

  // Swipe gesture & tutorial animation states
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasDeclined, setHasDeclined] = useState(false);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  // Hide tutorial hint after 6 seconds or on first interaction
  useEffect(() => {
    if (isActive) {
      setShowSwipeHint(true);
      const timer = setTimeout(() => {
        setShowSwipeHint(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/v1/captains/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Captain Logout Error:', error);
    } finally {
      localStorage.removeItem('token');
      logoutCaptain();
      navigate('/captain-login');
    }
  };

  const toggleStatus = (status) => {
    setIsActive(status);
    setShowStatusMenu(false);
    setHasAccepted(false);
    setHasDeclined(false);
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  // Touch / Drag event handlers for Swipe Acceptance & Rejection
  const handleTouchStart = (e) => {
    setIsDragging(true);
    startXRef.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches ? e.touches[0].clientX : e.clientX;
    const diff = currentX - startXRef.current;
    // Limit drag range
    if (diff > -180 && diff < 180) {
      setDragX(diff);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragX > 90) {
      // Swiped Right -> Accept
      acceptCurrentRide();
    } else if (dragX < -90) {
      // Swiped Left -> Reject
      declineCurrentRide();
    } else {
      setDragX(0);
    }
  };

  const acceptCurrentRide = () => {
    setHasAccepted(true);
    setDragX(200);
    if (onAcceptRide) onAcceptRide(currentRide);
  };

  const declineCurrentRide = () => {
    setHasDeclined(true);
    setDragX(-200);
    if (onDeclineRide) onDeclineRide(currentRide);
  };

  return (
    <div className="relative h-full w-full bg-[#f2f4f8] relative flex flex-col justify-between overflow-hidden select-none font-['Outfit',sans-serif]">
      {/* ================= MAP DISPLAY BACKGROUND ================= */}
      <div className="relative h-full w-full bg-[#e5e9f0] overflow-hidden flex items-center justify-center">
        {/* Background Map Route Image */}
        <img
          src={mapBg}
          alt="Captain Map Navigation"
          className="absolute inset-0 w-full h-[105%] object-cover object-center pointer-events-none"
        />

        {/* Overlay map gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35 pointer-events-none" />

        {/* ================= TOP HEADER BAR ================= */}
        <div className="absolute top-5 left-5 right-5 z-50 flex items-start justify-between">
          {/* Brand Logo */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-1.5 drop-shadow-[0_2px_4px_rgba(255,255,255,0.9)]">
              <span className="text-[#1d27c9]">PrimeRide</span>
              <span className="text-[#0d1b69] font-bold text-lg sm:text-xl">Captain's</span>
            </h1>
            <p className="text-[11px] font-bold text-neutral-600 tracking-wide uppercase">
              Welcome, Captain {captain?.firstName || 'Driver'}
            </p>
          </div>

          {/* Right Side: Active / In-active Dropdown Toggle & Profile */}
          <div className="flex items-center gap-2">
            {/* Status Selector Dropdown matching screenshot */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`px-4 py-2 rounded-2xl font-black text-sm shadow-lg border transition-all flex items-center gap-2 cursor-pointer ${isActive
                  ? 'bg-emerald-500 text-white border-emerald-400 ring-2 ring-emerald-500/20'
                  : 'bg-neutral-200 text-neutral-800 border-neutral-300 hover:bg-neutral-300'
                  }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-neutral-500'}`} />
                <span>{isActive ? 'Active' : 'In-active'}</span>
                <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Status Selector Menu */}
              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-36 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-neutral-100 p-1.5 z-50 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => toggleStatus(true)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${isActive ? 'bg-emerald-50 text-emerald-700 font-black' : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                  >
                    <span>Active</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleStatus(false)}
                    className={`w-full text-left px-3 py-2 mt-1 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${!isActive ? 'bg-neutral-100 text-neutral-900 font-black' : 'hover:bg-neutral-100 text-neutral-700'
                      }`}
                  >
                    <span>In-active</span>
                    {!isActive && <span className="w-2 h-2 rounded-full bg-neutral-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Captain Avatar Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white/60 flex items-center justify-center text-neutral-800 font-bold hover:bg-white active:scale-95 transition-all cursor-pointer"
                title="Captain Menu"
              >
                {captain?.firstName ? captain.firstName.charAt(0).toUpperCase() : 'C'}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-100 p-2 z-50 animate-fadeIn">
                  <div className="px-3 py-2 border-b border-neutral-100">
                    <p className="text-sm font-bold text-neutral-900">{captain?.firstName || 'Captain'} {captain?.lastName || ''}</p>
                    <p className="text-xs text-neutral-500 truncate">{captain?.emailId || 'captain@primeride.com'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 mt-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>Logout Console</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM DRAWER / PANEL SECTION ================= */}
      <div className="relative fixed left-0 right-0 bottom-0 z-40 p-4 pb-6 font-['Outfit',sans-serif]">

        {/* ================= INACTIVE STATE WARNING DRAWER ================= */}
        {!isActive ? (
          <div className="w-full bg-[#0c1868] text-white rounded-[28px] p-6 shadow-2xl border border-white/20 flex flex-col items-center justify-center text-center animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white mb-1">
              Update Status to Get Rides!
            </h2>
            <p className="text-xs text-blue-200 font-medium max-w-xs mb-4">
              You are currently set to In-active. Switch status to Active at the top to start receiving nearby rider requests.
            </p>

            <button
              type="button"
              onClick={() => toggleStatus(true)}
              className="w-full max-w-xs bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold text-base py-3.5 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-400"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
              <span>Go Active Now</span>
            </button>
          </div>
        ) : (
          /* ================= ACTIVE STATE: RIDE REQUEST CARD (MATCHING SCREENSHOT) ================= */
          <div className="relative w-full">

            {/* --- SWIPE THUMB ANIMATION & DEMONSTRATION POPUP --- */}
            {showSwipeHint && !hasAccepted && !hasDeclined && (
              <div className="mb-3 w-full bg-white/95 backdrop-blur-xl border border-white/60 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between animate-bounce z-50">
                <div className="flex items-center gap-3">
                  {/* Animated Hand/Thumb icon demonstration */}
                  <div className="w-10 h-10 rounded-xl bg-[#121da6]/10 text-[#121da6] flex items-center justify-center font-bold text-xl animate-pulse">
                    👍
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-black tracking-wider">
                      Gesture Hint
                    </h4>
                    <p className="text-xs font-semibold text-neutral-600">
                      Swipe <span className="text-emerald-600 font-bold">Right 👉 to Accept</span> or <span className="text-red-600 font-bold">Left 👈 to Reject</span>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSwipeHint(false)}
                  className="text-neutral-400 hover:text-black font-bold text-xs p-1"
                >
                  ✕
                </button>
              </div>
            )}

            {/* --- SWIPEABLE RIDE CARD MATCHING SCREENSHOT EXACTLY --- */}
            {!hasAccepted && !hasDeclined ? (
              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                style={{
                  transform: `translateX(${dragX}px) rotate(${dragX * 0.04}deg)`,
                  transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
                className="w-full bg-[#0c1868] text-white rounded-[28px] p-6 shadow-[0_16px_40px_rgba(12,24,104,0.6)] border border-white/20 flex flex-col justify-between cursor-grab active:cursor-grabbing select-none relative overflow-hidden"
              >
                {/* Visual Drag Action Overlay Indicators */}
                {dragX > 20 && (
                  <div className="absolute inset-0 bg-emerald-600/30 backdrop-blur-xs rounded-[28px] flex items-center justify-start pl-8 font-black text-2xl text-emerald-300 pointer-events-none animate-fadeIn">
                    ACCEPT RIDE 👉
                  </div>
                )}
                {dragX < -20 && (
                  <div className="absolute inset-0 bg-red-600/30 backdrop-blur-xs rounded-[28px] flex items-center justify-end pr-8 font-black text-2xl text-red-300 pointer-events-none animate-fadeIn">
                    👈 DECLINE RIDE
                  </div>
                )}

                {/* Main Card Grid Layout matching the screenshot */}
                <div className="flex items-start justify-between min-h-[110px]">

                  {/* Left Column: Distance & Duration */}
                  <div className="flex flex-col justify-center pr-4">
                    <div className="flex items-baseline">
                      <span className="text-4xl sm:text-5xl font-black tracking-tight text-white">
                        {currentRide.distance.replace('km', '').trim()}
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white ml-1">
                        km
                      </span>
                    </div>

                    <p className="text-base sm:text-lg font-bold text-blue-200 mt-1 leading-tight">
                      {currentRide.duration}
                    </p>
                    <p className="text-base sm:text-lg font-bold text-blue-200 leading-tight">
                      Ride
                    </p>
                  </div>

                  {/* Right Column: From Location, To Location & Fare Pill */}
                  <div className="flex-1 flex flex-col items-end text-right pl-2">

                    {/* Pickup Address */}
                    <div className="mb-2">
                      <span className="text-xs font-semibold text-blue-300/80 block uppercase tracking-wider">
                        From:
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white block leading-tight">
                        {currentRide.pickup}
                      </span>
                    </div>

                    {/* Destination Address */}
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-blue-300/80 block uppercase tracking-wider">
                        To:
                      </span>
                      <span className="text-lg sm:text-xl font-black text-white block leading-tight">
                        {currentRide.destination}
                      </span>
                    </div>

                    {/* Fare Pill matching exact screenshot styling (Black Pill with White Text) */}
                    <div className="bg-black text-white font-extrabold text-lg sm:text-xl px-5 py-2.5 rounded-full shadow-lg border border-neutral-800 tracking-wide flex items-center gap-1.5">
                      <span className="text-neutral-300 text-sm font-semibold">Fair :</span>
                      <span>{currentRide.fare}</span>
                    </div>

                  </div>
                </div>

                {/* Quick Touch Action Buttons below for accessibility */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={declineCurrentRide}
                    className="flex-1 bg-white/10 hover:bg-red-600/30 text-red-200 hover:text-white font-bold text-xs py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer text-center"
                  >
                    👈 Swipe Left to Decline
                  </button>

                  <button
                    type="button"
                    onClick={acceptCurrentRide}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2.5 rounded-xl border border-emerald-400 shadow-md transition-all cursor-pointer text-center"
                  >
                    Swipe Right to Accept 👉
                  </button>
                </div>

              </div>
            ) : hasAccepted ? (
              /* ACCEPTED RIDE STATE CARD */
              <div className="w-full bg-emerald-700 text-white rounded-[28px] p-6 shadow-2xl border border-emerald-400 flex flex-col items-center text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center mb-2 font-black text-2xl">
                  ✓
                </div>
                <h3 className="text-2xl font-black">Ride Accepted!</h3>
                <p className="text-xs text-emerald-100 font-medium mt-1">
                  Navigating to pickup location at {currentRide.pickup}...
                </p>

                <div className="w-full mt-4 p-3 bg-emerald-800/60 rounded-xl flex items-center justify-between text-left text-xs font-bold">
                  <span>Passenger: {currentRide.passengerName}</span>
                  <span>Fare: {currentRide.fare}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setHasAccepted(false);
                    setDragX(0);
                  }}
                  className="mt-4 text-xs font-bold underline text-emerald-200 hover:text-white"
                >
                  Reset Demo Request
                </button>
              </div>
            ) : (
              /* DECLINED RIDE STATE CARD */
              <div className="w-full bg-neutral-900 text-white rounded-[28px] p-6 shadow-2xl border border-neutral-800 flex flex-col items-center text-center animate-fadeIn">
                <h3 className="text-xl font-bold text-neutral-300">Ride Request Declined</h3>
                <p className="text-xs text-neutral-500 mt-1">Waiting for next nearby rider request...</p>

                <button
                  type="button"
                  onClick={() => {
                    setHasDeclined(false);
                    setDragX(0);
                  }}
                  className="mt-4 text-xs font-bold underline text-blue-400 hover:text-blue-300"
                >
                  Simulate New Request
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default CaptionHome;