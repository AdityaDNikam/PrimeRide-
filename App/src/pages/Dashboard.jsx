import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../services/axios';

const Dashboard = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  // Interactive UI states
  const [isWhereTooOpen, setIsWhereTooOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [pickup, setPickup] = useState('Current Location');
  const [destination, setDestination] = useState('');
  const [selectedRide, setSelectedRide] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/v1/users/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('User Logout Error:', error);
    } finally {
      localStorage.removeItem('token');
      logoutUser();
      navigate('/login');
    }
  };

  const handleSelectDestination = (place) => {
    setDestination(place);
    setIsWhereTooOpen(false);
    setIsExploreOpen(true);
  };

  return (
    <div className="h-full w-full bg-[#f2f4f8] relative flex flex-col justify-between overflow-hidden select-none font-['Outfit',sans-serif]">
      {/* ================= MAP DISPLAY SECTION (TOP ~68% HEIGHT) ================= */}
      <div className="relative h-[68%] w-full bg-[#f0f3f8] overflow-hidden">
        
        {/* --- Map Grid Lines Background (City Streets Vector) --- */}
        <svg className="absolute inset-0 w-full h-full opacity-70" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="streetGrid" width="120" height="120" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
              <rect width="120" height="120" fill="#f2f4f8" />
              {/* Blocks / Buildings */}
              <rect x="10" y="10" width="45" height="40" rx="4" fill="#ffffff" stroke="#e1e6ef" strokeWidth="1.5" />
              <rect x="65" y="10" width="45" height="40" rx="4" fill="#ffffff" stroke="#e1e6ef" strokeWidth="1.5" />
              <rect x="10" y="60" width="45" height="50" rx="4" fill="#ffffff" stroke="#e1e6ef" strokeWidth="1.5" />
              <rect x="65" y="60" width="45" height="50" rx="4" fill="#ffffff" stroke="#e1e6ef" strokeWidth="1.5" />
              {/* Secondary roads */}
              <line x1="0" y1="55" x2="120" y2="55" stroke="#e2e7f0" strokeWidth="6" />
              <line x1="60" y1="0" x2="60" y2="120" stroke="#e2e7f0" strokeWidth="6" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streetGrid)" />
        </svg>

        {/* --- Blue Route Line SVG --- */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" xmlns="http://www.w3.org/2000/svg">
          {/* Main Blue Zag Line */}
          <polyline
            points="180,240 300,210 160,180 238,88"
            fill="none"
            stroke="#1d55e8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Origin Starting Dot */}
          <circle cx="180" cy="240" r="4" fill="#1d55e8" />
        </svg>

        {/* --- Top Header: Brand Logo & User Menu --- */}
        <div className="absolute top-5 left-5 right-5 z-30 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#1d27c9] tracking-tight drop-shadow-sm">
            PrimeRide
          </h1>

          {/* User Profile / Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white/60 flex items-center justify-center text-neutral-800 font-bold hover:bg-white active:scale-95 transition-all"
              title="User Account"
            >
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-100 p-2 z-50 animate-fadeIn">
                <div className="px-3 py-2 border-b border-neutral-100">
                  <p className="text-sm font-bold text-neutral-900">{user.firstName || 'Rider'} {user.lastName || ''}</p>
                  <p className="text-xs text-neutral-500 truncate">{user.emailId || 'rider@primeride.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 mt-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>Logout Account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- Top-Down Car Markers (3 Cars) --- */}

        {/* Car 1: Top Left */}
        <div className="absolute top-[20%] left-[16%] z-20 transform -rotate-[35deg] drop-shadow-md">
          <svg width="40" height="24" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="42" height="26" rx="8" fill="#2d2d34" />
            <rect x="12" y="5" width="26" height="20" rx="5" fill="#1a1a20" />
            {/* Front windshield */}
            <path d="M34 7C36 7 37 8 37 15C37 22 36 23 34 23Z" fill="#525b68" />
            {/* Rear windshield */}
            <path d="M16 7C14 7 13 8 13 15C13 22 14 23 16 23Z" fill="#525b68" />
            {/* Side mirrors */}
            <rect x="30" y="0" width="3" height="3" rx="1" fill="#1a1a20" />
            <rect x="30" y="27" width="3" height="3" rx="1" fill="#1a1a20" />
          </svg>
        </div>

        {/* Car 2: Middle Left */}
        <div className="absolute top-[40%] left-[10%] z-20 transform -rotate-[15deg] drop-shadow-md">
          <svg width="42" height="25" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="42" height="26" rx="8" fill="#32343a" />
            <rect x="12" y="5" width="26" height="20" rx="5" fill="#1c1d22" />
            <path d="M34 7C36 7 37 8 37 15C37 22 36 23 34 23Z" fill="#47505d" />
            <path d="M16 7C14 7 13 8 13 15C13 22 14 23 16 23Z" fill="#47505d" />
          </svg>
        </div>

        {/* Car 3: Bottom Right near badge */}
        <div className="absolute top-[58%] right-[6%] z-20 transform rotate-[70deg] drop-shadow-md">
          <svg width="38" height="23" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="4" y="2" width="42" height="26" rx="8" fill="#292a30" />
            <rect x="12" y="5" width="26" height="20" rx="5" fill="#18191e" />
            <path d="M34 7C36 7 37 8 37 15C37 22 36 23 34 23Z" fill="#4a5360" />
          </svg>
        </div>

        {/* --- Destination Location Pin with Concentric Glowing Aura Circles --- */}
        <div className="absolute top-[17%] right-[22%] z-20 flex flex-col items-center justify-center">
          {/* Outer glowing blue rings */}
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 bg-blue-500/20 rounded-full border border-blue-400/30 animate-ping absolute" />
            <div className="w-12 h-12 bg-blue-500/25 rounded-full border border-blue-500/40 flex items-center justify-center shadow-lg backdrop-blur-xs">
              <div className="w-4 h-4 bg-blue-600 rounded-full shadow-inner border border-white" />
            </div>

            {/* Black Teardrop Pin Icon Above */}
            <div className="absolute -top-7 transform -translate-y-1">
              <svg width="28" height="34" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg">
                <path
                  d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0Z"
                  fill="#000000"
                />
                <circle cx="12" cy="11" r="4" fill="#ffffff" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- Floating "LET's Go" Black Pill Badge --- */}
        <div className="absolute bottom-3 right-8 z-30">
          <button
            onClick={() => setIsExploreOpen(true)}
            className="bg-black hover:bg-neutral-900 active:scale-95 text-white font-extrabold text-lg px-6 py-2.5 rounded-2xl shadow-xl flex items-center justify-center border border-neutral-800 tracking-wide transition-all"
          >
            LET’s Go
          </button>
        </div>
      </div>

      {/* ================= BLUE BOTTOM SHEET CONTAINER (~32% HEIGHT) ================= */}
      <div className="h-[32%] w-full bg-[#121da6] rounded-t-[36px] px-6 py-6 flex flex-col justify-center items-center shadow-[0_-10px_40px_rgba(18,29,166,0.5)] relative z-20 border-t border-blue-600/30">
        <div className="w-full max-w-md flex flex-col gap-4">
          
          {/* Top Pill Input/Button: "Where Too..!!" */}
          <button
            onClick={() => setIsWhereTooOpen(true)}
            className="w-full bg-[#929bca] hover:bg-[#858fc2] active:scale-[0.99] text-white font-bold text-xl px-7 py-4 rounded-[26px] shadow-md flex items-center justify-between tracking-wide transition-all text-left"
          >
            <span className="truncate">{destination ? destination : 'Where Too..!!'}</span>
            <svg className="w-5 h-5 text-white/80 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Bottom Primary Button: "Explore More Rides" */}
          <button
            onClick={() => setIsExploreOpen(true)}
            className="w-full bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-xl px-7 py-4 rounded-[26px] shadow-2xl flex items-center justify-center tracking-wide transition-all border border-neutral-900/60"
          >
            <span>Explore More Rides</span>
          </button>

        </div>
      </div>

      {/* ================= INTERACTIVE MODAL: "Where Too..!!" Search Drawer ================= */}
      {isWhereTooOpen && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end animate-fadeIn">
          <div className="w-full bg-neutral-900 rounded-t-[32px] border-t border-neutral-800 p-6 flex flex-col max-h-[85%] overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-white">Select Destination</h3>
              <button
                onClick={() => setIsWhereTooOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Input fields */}
            <div className="flex flex-col gap-3 mb-5">
              <div className="relative">
                <span className="absolute left-4 top-3.5 w-3 h-3 rounded-full bg-blue-500" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Pickup Location"
                  className="w-full bg-neutral-800 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="relative">
                <span className="absolute left-4 top-3.5 w-3 h-3 rounded-sm bg-emerald-500" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where to?"
                  autoFocus
                  className="w-full bg-neutral-800 text-white text-sm pl-10 pr-4 py-3 rounded-xl border border-neutral-700 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Suggested Places Quick Select */}
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Popular Destinations</p>
            <div className="flex flex-col gap-2">
              {[
                { name: 'City Center Mall', dist: '2.4 km', time: '8 mins' },
                { name: 'International Airport T2', dist: '14.8 km', time: '28 mins' },
                { name: 'Tech Park Central Gate', dist: '5.1 km', time: '14 mins' },
                { name: 'Central Railway Station', dist: '7.3 km', time: '18 mins' },
              ].map((place, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectDestination(place.name)}
                  className="flex items-center justify-between p-3.5 bg-neutral-800/60 hover:bg-neutral-800 rounded-xl border border-neutral-700/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{place.name}</p>
                      <p className="text-xs text-neutral-400">{place.dist} • {place.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-blue-400">Select</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= INTERACTIVE MODAL: "Explore More Rides" Selector ================= */}
      {isExploreOpen && (
        <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex flex-col justify-end animate-fadeIn">
          <div className="w-full bg-neutral-900 rounded-t-[32px] border-t border-neutral-800 p-6 flex flex-col max-h-[85%] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Available Rides</h3>
                <p className="text-xs text-neutral-400">Destination: {destination || 'City Center'}</p>
              </div>
              <button
                onClick={() => setIsExploreOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Ride options list */}
            <div className="flex flex-col gap-3 mb-5">
              {[
                { type: 'Prime Sedan', capacity: '4 seats', eta: '3 mins away', price: '$18.50', icon: '🚗' },
                { type: 'Prime Auto', capacity: '3 seats', eta: '2 mins away', price: '$11.20', icon: '🛺' },
                { type: 'Prime Bike', capacity: '1 seat', eta: '1 min away', price: '$6.40', icon: '🏍️' },
                { type: 'Prime SUV', capacity: '6 seats', eta: '5 mins away', price: '$26.00', icon: '🚙' },
              ].map((ride, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRide(ride.type)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedRide === ride.type
                      ? 'bg-blue-600/20 border-blue-500 shadow-lg'
                      : 'bg-neutral-800/60 border-neutral-700/60 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{ride.icon}</span>
                    <div>
                      <h4 className="text-base font-bold text-white flex items-center gap-2">
                        {ride.type}
                        <span className="text-[10px] bg-neutral-700 px-2 py-0.5 rounded-full text-neutral-300 font-normal">
                          {ride.capacity}
                        </span>
                      </h4>
                      <p className="text-xs text-emerald-400 font-medium">{ride.eta}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-white">{ride.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                alert(`Ride Confirmed! Your ${selectedRide || 'Prime Sedan'} is on its way.`);
                setIsExploreOpen(false);
              }}
              className="w-full bg-[#121da6] hover:bg-[#0f188f] active:scale-[0.98] text-white font-bold text-lg py-3.5 rounded-2xl shadow-xl transition-all"
            >
              Confirm {selectedRide || 'Prime Ride'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
