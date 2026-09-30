import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../services/axios';
import mapBg from '../assets/map_bg.png';

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
      <div className="relative h-[68%] w-full bg-[#e5e9f0] overflow-hidden flex items-center justify-center">
        {/* --- Background Route Image --- */}
        <img
          src={mapBg}
          alt="Map Route"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
        />

        {/* Overlay subtle gradient to seamlessly blend headers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* --- Top Header: Brand Logo & User Menu --- */}
        <div className="absolute top-5 left-5 right-5 z-30 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#1d27c9] tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
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
