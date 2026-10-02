import React, { useState } from 'react';
import uberGoImg from '../assets/uber_go.png';
import uberMotoImg from '../assets/uber_moto.png';
import uberAutoImg from '../assets/uber_auto.png';

export const RIDE_OPTIONS = [
  {
    id: 'ubergo',
    name: 'UberGo',
    capacity: 4,
    eta: '2 mins away',
    description: 'Affordable, compact rides',
    price: '₹193.20',
    image: uberGoImg
  },
  {
    id: 'moto',
    name: 'Moto',
    capacity: 1,
    eta: '3 mins away',
    description: 'Affordable motorcycle rides',
    price: '₹65',
    image: uberMotoImg
  },
  {
    id: 'uberauto',
    name: 'UberAuto',
    capacity: 3,
    eta: '3 mins away',
    description: 'Affordable Auto rides',
    price: '₹118.86',
    image: uberAutoImg
  }
];

const RideOptionsSelector = ({
  pickup = '',
  destination = '',
  onClose,
  onConfirmRide
}) => {
  const [selectedRide, setSelectedRide] = useState('ubergo');

  const activeOption = RIDE_OPTIONS.find((r) => r.id === selectedRide) || RIDE_OPTIONS[0];

  return (
    <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end animate-fadeIn font-['Outfit',sans-serif]">
      {/* Sliding Sheet Container */}
      <div className="w-full bg-white rounded-t-[32px] p-6 flex flex-col max-h-[85%] shadow-2xl border-t border-neutral-100">
        
        {/* Top Header Row with Handle & Close Button */}
        <div className="flex items-center justify-between pb-4 mb-2 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-bold text-black tracking-tight">
              Choose a ride
            </h2>
            {(pickup || destination) && (
              <p className="text-xs text-neutral-500 font-medium truncate max-w-xs mt-0.5">
                {pickup || 'Current Location'} ➔ {destination || 'Destination'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
            title="Close ride selection"
          >
            ✕
          </button>
        </div>

        {/* Ride Options Cards List */}
        <div className="flex flex-col gap-3 my-3 overflow-y-auto pr-1">
          {RIDE_OPTIONS.map((ride) => {
            const isSelected = selectedRide === ride.id;
            return (
              <div
                key={ride.id}
                onClick={() => setSelectedRide(ride.id)}
                className={`flex items-center justify-between p-4 rounded-2xl transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-neutral-50 border-2 border-black shadow-md'
                    : 'bg-white border border-neutral-200 hover:border-neutral-400'
                }`}
              >
                {/* Left Side: Vehicle Image */}
                <div className="w-20 h-14 shrink-0 flex items-center justify-center mr-3">
                  <img
                    src={ride.image}
                    alt={ride.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                  />
                </div>

                {/* Center: Ride Information */}
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-black tracking-tight">
                      {ride.name}
                    </h3>
                    <span className="inline-flex items-center text-xs font-bold text-black bg-neutral-100 px-1.5 py-0.5 rounded-md">
                      <svg
                        className="w-3 h-3 mr-0.5 fill-black"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      {ride.capacity}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-black mt-0.5">
                    {ride.eta}
                  </p>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5 truncate">
                    {ride.description}
                  </p>
                </div>

                {/* Right Side: Price */}
                <div className="text-right shrink-0">
                  <p className="text-xl font-black text-black tracking-tight">
                    {ride.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Confirm Action Button */}
        <div className="pt-2 mt-auto">
          <button
            onClick={() => {
              if (onConfirmRide) {
                onConfirmRide(activeOption);
              }
            }}
            className="w-full bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-lg py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-2 tracking-wide transition-all cursor-pointer"
          >
            <span>Confirm {activeOption.name}</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default RideOptionsSelector;
