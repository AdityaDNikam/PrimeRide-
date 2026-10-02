import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../services/axios';
import mapBg from '../assets/map_bg.png';
import LocationSearchPanel from '../components/LocationSearchPanel';
import RideOptionsSelector from '../components/RideOptionsSelector';

const Dashboard = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  // Interactive UI states
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [pickup, setPickup] = useState('Current Location');
  const [destination, setDestination] = useState('');
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

  return (
    <div className="h-full w-full bg-[#f2f4f8] relative flex flex-col justify-between overflow-hidden select-none font-['Outfit',sans-serif]">
      {/* ================= MAP DISPLAY SECTION ================= */}
      <div className="relative h-full w-full bg-[#e5e9f0] overflow-hidden flex items-center justify-center">
        {/* --- Background Route Image --- */}
        <img
          src={mapBg}
          alt="Map Route"
          className="absolute inset-0 w-full h-[105%] object-cover object-center pointer-events-none"
        />

        {/* Overlay subtle gradient to seamlessly blend headers */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />

        {/* --- Top Header: Brand Logo & User Menu --- */}
        <div className="absolute top-5 left-5 right-5 z-50 flex items-center justify-between">
          <h1 className="text-3xl font-black text-[#1d27c9] tracking-tight drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
            PrimeRide
          </h1>

          {/* User Profile / Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md shadow-md border border-white/60 flex items-center justify-center text-neutral-800 font-bold hover:bg-white active:scale-95 transition-all cursor-pointer"
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
                  className="w-full text-left px-3 py-2 mt-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-between cursor-pointer"
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
      </div>

      {/* ================= REUSABLE LOCATION SEARCH PANEL (AT BOTTOM / FLOWS UP) ================= */}
      <LocationSearchPanel
        pickup={pickup}
        setPickup={setPickup}
        destination={destination}
        setDestination={setDestination}
        isExpanded={isSearchExpanded}
        setIsExpanded={setIsSearchExpanded}
        onConfirmSearch={() => {
          setIsSearchExpanded(false);
          setIsExploreOpen(true);
        }}
      />

      {/* ================= RIDE SELECTION MODAL MATCHING SNIPPET ================= */}
      {isExploreOpen && (
        <RideOptionsSelector
          pickup={pickup}
          destination={destination}
          onClose={() => setIsExploreOpen(false)}
          onConfirmRide={(ride) => {
            alert(`Ride Confirmed! Your ${ride.name} (${ride.price}) is on its way.`);
            setIsExploreOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
