import React from 'react';
import { Link } from 'react-router-dom';
import trafficBg from '../assets/traffic-signal.png';
import { useUser } from '../context/UserContext';
import { useCaptain } from '../context/CaptainContext';

const Home = () => {
  const { user, isUserAuthenticated, logoutUser } = useUser();
  const { captain, isCaptainAuthenticated, logoutCaptain } = useCaptain();

  return (
    <div className="h-full w-full flex flex-col justify-between bg-black select-none overflow-hidden font-['Outfit',sans-serif]">
      {/* Top Main Visual Container with Traffic Signal Background */}
      <div 
        className="relative h-[72%] w-full bg-cover bg-center flex flex-col justify-between p-6"
        style={{ 
          backgroundImage: `url(${trafficBg})`,
        }}
      >
        {/* Soft overlay gradient to guarantee crisp logo visibility over traffic signal background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/40 to-transparent pointer-events-none" />

        {/* Brand Logo Header */}
        <div className="relative z-10 pt-4 pl-2 flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2b14be] drop-shadow-sm">
            PrimeRide
          </h1>

          {/* Active Context Status Pill */}
          {isUserAuthenticated && (
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{user.firstName || user.username || 'Rider'}</span>
              <button onClick={logoutUser} className="text-neutral-400 hover:text-white ml-1 font-bold">✕</button>
            </div>
          )}
          {isCaptainAuthenticated && !isUserAuthenticated && (
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/40 text-xs text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              <span>Capt. {captain.firstName || captain.username || 'Driver'}</span>
              <button onClick={logoutCaptain} className="text-neutral-400 hover:text-white ml-1 font-bold">✕</button>
            </div>
          )}
        </div>

        {/* Mobile Status Tag */}
        <div className="relative z-10 self-start mb-2">
          <span className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Urban Mobility
          </span>
        </div>
      </div>

      {/* Bottom Mobile Card / Sheet Container */}
      <div className="h-[28%] w-full bg-[#1c129e] flex flex-col justify-center px-6 py-6 rounded-t-3xl shadow-2xl relative z-20">
        <div className="w-full flex flex-col justify-center h-full max-w-sm mx-auto">
          {/* Main Card Title */}
          <h2 className="text-white text-2xl font-semibold mb-5 tracking-tight">
            {isUserAuthenticated
              ? `Welcome back, ${user.firstName || 'Rider'}!`
              : isCaptainAuthenticated
              ? `Welcome back, Captain!`
              : "Let's Get Started"}
          </h2>

          {/* Action Button - Mobile Touch Optimized */}
          <Link
            to={isUserAuthenticated ? "/login" : "/login"}
            className="w-full bg-black text-white text-center py-3.5 px-6 rounded-full text-lg font-medium tracking-wide transition-all duration-200 hover:bg-neutral-900 active:scale-95 shadow-xl flex items-center justify-center active:bg-neutral-800"
          >
            <span>Time Matters...!</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

