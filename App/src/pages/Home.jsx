import React from 'react';
import { Link } from 'react-router-dom';
import trafficBg from '../assets/traffic-signal.png';

const Home = () => {
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
        <div className="relative z-10 pt-4 pl-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#2b14be] drop-shadow-sm">
            PrimeRide
          </h1>
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
            Lets Get Started
          </h2>

          {/* Action Button - Mobile Touch Optimized */}
          <Link
            to="/login"
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
