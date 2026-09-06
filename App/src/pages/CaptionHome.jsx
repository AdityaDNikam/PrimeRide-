import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaptain } from '../context/CaptainContext';
import axiosInstance from '../services/axios';

const CaptionHome = () => {
  const { captain, logoutCaptain } = useCaptain();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post('/api/v1/captains/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Captain Logout Error:', error);
    } finally {
      localStorage.removeItem('token');
      logoutCaptain();
      navigate('/captain-login');
    }
  };

  return (
    <div className="h-full w-full bg-black text-white p-6 flex flex-col justify-between font-['Outfit',sans-serif]">
      {/* Top Bar */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-amber-400">PrimeRide</h1>
          <p className="text-xs text-neutral-400">Captain Console</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold rounded-full border border-neutral-700 transition-colors"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center my-auto">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">
          Welcome, Captain {captain.firstName || 'Driver'}!
        </h2>
        <p className="text-sm text-neutral-400 max-w-xs">
          Protected Captain Home Page. Token verified successfully.
        </p>
      </div>

      {/* Status Footer */}
      <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 text-center">
        <span className="text-xs text-amber-400 font-medium flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          Captain Online & Ready for Rides
        </span>
      </div>
    </div>
  );
};

export default CaptionHome;