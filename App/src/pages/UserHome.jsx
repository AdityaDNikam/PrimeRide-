import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const UserHome = () => {
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="h-full w-full bg-black text-white p-6 flex flex-col justify-between font-['Outfit',sans-serif]">
      {/* Top Bar */}
      <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-[#38bdf8]">PrimeRide</h1>
          <p className="text-xs text-neutral-400">Rider Dashboard</p>
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
        <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mb-4 border border-blue-500/20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-1">
          Welcome, {user.firstName || 'Rider'}!
        </h2>
        <p className="text-sm text-neutral-400 max-w-xs">
          Protected User Home Page. Token verified successfully.
        </p>
      </div>

      {/* Status Footer */}
      <div className="p-4 bg-neutral-900/60 rounded-xl border border-neutral-800 text-center">
        <span className="text-xs text-emerald-400 font-medium flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Active Authenticated Session
        </span>
      </div>
    </div>
  );
};

export default UserHome;