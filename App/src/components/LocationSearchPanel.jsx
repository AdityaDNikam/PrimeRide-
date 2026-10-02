import React, { useState, useRef } from 'react';

// Sample realistic locations array for search suggestions
export const SAMPLE_ADDRESSES = [
  {
    id: 1,
    title: 'City Center Mall',
    subtitle: '123 Main Street, Downtown Commercial Hub',
    distance: '1.2 km',
    category: 'Shopping & Dining',
    iconType: 'shopping'
  },
  {
    id: 2,
    title: 'International Airport T2',
    subtitle: 'Airport Expressway, Departure Gate 4',
    distance: '14.8 km',
    category: 'Travel Hub',
    iconType: 'airport'
  },
  {
    id: 3,
    title: 'Tech Park Central Gate',
    subtitle: 'Innovation Way, Sector 5 Cyber City',
    distance: '5.1 km',
    category: 'Business Park',
    iconType: 'work'
  },
  {
    id: 4,
    title: 'Central Railway Station',
    subtitle: 'Station Road, Platform 1 Main Exit',
    distance: '3.4 km',
    category: 'Transit',
    iconType: 'transit'
  },
  {
    id: 5,
    title: 'Grand Galleria Plaza',
    subtitle: '456 Fashion Boulevard, West End District',
    distance: '2.8 km',
    category: 'Shopping Mall',
    iconType: 'shopping'
  },
  {
    id: 6,
    title: 'Ocean View Promenade',
    subtitle: '789 Marine Drive, Bay Area Front',
    distance: '8.5 km',
    category: 'Leisure & Park',
    iconType: 'park'
  },
  {
    id: 7,
    title: 'City General Hospital',
    subtitle: 'Medical Drive, Emergency Gate B',
    distance: '2.4 km',
    category: 'Healthcare',
    iconType: 'hospital'
  }
];

const LocationSearchPanel = ({
  pickup = 'Current Location',
  setPickup,
  destination = '',
  setDestination,
  isExpanded = false,
  setIsExpanded,
  onConfirmSearch
}) => {
  const [activeField, setActiveField] = useState('destination'); // 'pickup' | 'destination'
  const pickupInputRef = useRef(null);
  const destinationInputRef = useRef(null);

  // Current active text for filtering
  const currentQuery = activeField === 'pickup' ? pickup : destination;

  const filteredAddresses = SAMPLE_ADDRESSES.filter((item) => {
    if (!currentQuery || currentQuery === 'Current Location') return true;
    const query = currentQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.subtitle.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  });

  const handleInputFocus = (field) => {
    setActiveField(field);
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleSelectAddress = (addressTitle) => {
    if (activeField === 'pickup') {
      setPickup(addressTitle);
      // Auto switch focus to destination if it's empty
      if (!destination) {
        setActiveField('destination');
        if (destinationInputRef.current) {
          destinationInputRef.current.focus();
        }
      }
    } else {
      setDestination(addressTitle);
    }
  };

  const renderLocationIcon = (iconType) => {
    switch (iconType) {
      case 'airport':
        return (
          <svg className="w-5 h-5 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'work':
        return (
          <svg className="w-5 h-5 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0v4" />
          </svg>
        );
      case 'transit':
        return (
          <svg className="w-5 h-5 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      case 'hospital':
        return (
          <svg className="w-5 h-5 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-[#121da6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative fixed left-0 right-0 z-40 bg-[#121da6] rounded-t-[32px] shadow-[0_-12px_45px_rgba(18,29,166,0.4)] transition-all duration-500 cubic-bezier(0.16,1,0.3,1) flex flex-col ${isExpanded
        ? 'top-16 bottom-0 rounded-t-[28px]'
        : 'bottom-0 max-h-[49%] pb-4'
        }`}
    >
      {/* Dynamic Header Handle / Collapse bar */}
      <div className="w-full pt-3 pb-2 flex flex-col items-center justify-center relative cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="w-12 h-1.5 bg-white/40 hover:bg-white/60 rounded-full transition-colors" />

      </div>

      {/* Main Content Area */}
      <div className="px-5 pb-5 flex-1 flex flex-col overflow-hidden">
        {/* White Card Container matching snippet styling */}
        <div className="bg-white rounded-2xl p-5 shadow-xl border border-white/40 flex flex-col gap-3 shrink-0">
          {/* Heading */}
          <h2 className="text-2xl font-black text-black tracking-tight select-none">
            Get a ride
          </h2>

          {/* Location Inputs Container with Connecting Line */}
          <div className="relative flex flex-col gap-3">
            {/* Visual connecting line between Pickup and Dropoff icons */}
            <div className="absolute left-[21px] top-[26px] bottom-[26px] w-[2px] bg-neutral-300 pointer-events-none z-10" />

            {/* Pickup Location Input */}
            <div
              onClick={() => handleInputFocus('pickup')}
              className={`relative flex items-center bg-[#f3f4f6] rounded-xl px-4 py-3 border transition-all cursor-text ${activeField === 'pickup' && isExpanded
                ? 'border-[#121da6] ring-2 ring-[#121da6]/20 bg-white'
                : 'border-transparent hover:bg-[#eaecef]'
                }`}
            >
              {/* Pickup Icon: Black Circle with White Dot */}
              <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 z-20 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>

              <input
                ref={pickupInputRef}
                type="text"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
                onFocus={() => handleInputFocus('pickup')}
                placeholder="Pickup location"
                className="w-full ml-3 bg-transparent text-black placeholder:text-neutral-500 font-semibold text-base focus:outline-none truncate"
              />

              {pickup && activeField === 'pickup' && isExpanded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPickup('');
                  }}
                  className="text-neutral-400 hover:text-neutral-700 p-1 font-bold text-xs rounded-full"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Dropoff Location Input */}
            <div
              onClick={() => handleInputFocus('destination')}
              className={`relative flex items-center bg-[#f3f4f6] rounded-xl px-4 py-3 border transition-all cursor-text ${activeField === 'destination' && isExpanded
                ? 'border-[#121da6] ring-2 ring-[#121da6]/20 bg-white'
                : 'border-transparent hover:bg-[#eaecef]'
                }`}
            >
              {/* Dropoff Icon: Black Square with White Center */}
              <div className="w-5 h-5 rounded-sm bg-black flex items-center justify-center shrink-0 z-20 shadow-sm">
                <div className="w-2 h-2 rounded-sm bg-white" />
              </div>

              <input
                ref={destinationInputRef}
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onFocus={() => handleInputFocus('destination')}
                placeholder="Dropoff location"
                className="w-full ml-3 bg-transparent text-black placeholder:text-neutral-500 font-semibold text-base focus:outline-none truncate"
              />

              {destination && activeField === 'destination' && isExpanded && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDestination('');
                  }}
                  className="text-neutral-400 hover:text-neutral-700 p-1 font-bold text-xs rounded-full"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Pop-up Search Rides Button: Appears right below the inputs when both from and to inputs (or destination) are filled */}
          {(pickup && destination) && (
            <button
              type="button"
              onClick={() => {
                if (onConfirmSearch) {
                  onConfirmSearch();
                }
              }}
              className="w-full mt-1 bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-base py-3.5 px-5 rounded-xl shadow-xl flex items-center justify-center gap-2 tracking-wide transition-all cursor-pointer animate-fadeIn border border-neutral-900"
            >
              <span>Search Rides</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          )}
        </div>

        {/* ================= EXPANDED VIEW SEARCH RESULTS LIST ================= */}
        {isExpanded && (
          <div className="mt-4 flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar animate-fadeIn">
            <div className="flex items-center justify-between px-1 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                {activeField === 'pickup' ? 'Select Pickup Location' : 'Suggested Destinations'}
              </span>
              <span className="text-[11px] text-white/50 font-medium">
                {filteredAddresses.length} places found
              </span>
            </div>

            {/* Current location quick choice */}
            <button
              onClick={() => handleSelectAddress('Current Location')}
              className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 active:scale-[0.99] rounded-xl border border-white/10 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <circle cx="12" cy="11" r="2" fill="currentColor" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    Use Current Location
                  </h4>
                  <p className="text-xs text-white/70">GPS High Accuracy</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                GPS
              </span>
            </button>

            {/* Address suggestion items */}
            {filteredAddresses.map((addr) => (
              <button
                key={addr.id}
                onClick={() => handleSelectAddress(addr.title)}
                className="flex items-center justify-between p-3.5 bg-white rounded-xl hover:bg-neutral-50 active:scale-[0.99] shadow-sm border border-neutral-100 transition-all text-left group"
              >
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#121da6]/10 flex items-center justify-center shrink-0 transition-colors">
                    {renderLocationIcon(addr.iconType)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900 group-hover:text-[#121da6] transition-colors truncate">
                      {addr.title}
                    </h4>
                    <p className="text-xs text-neutral-500 truncate">
                      {addr.subtitle}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-neutral-700 bg-neutral-100 px-2 py-1 rounded-md block">
                    {addr.distance}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                    {addr.category}
                  </span>
                </div>
              </button>
            ))}

            {filteredAddresses.length === 0 && (
              <div className="py-8 text-center bg-white/10 rounded-2xl border border-white/10">
                <p className="text-sm font-bold text-white">No locations found</p>
                <p className="text-xs text-white/60 mt-1">Try searching for another landmark or address</p>
              </div>
            )}
          </div>
        )}

        {/* Action Button: "Find Ride" / "Confirm Locations" when destination is chosen */}
        {destination && (
          <div className="mt-3 shrink-0">
            <button
              onClick={() => {
                if (onConfirmSearch) {
                  onConfirmSearch();
                }
              }}
              className="w-full bg-black hover:bg-neutral-900 active:scale-[0.98] text-white font-bold text-lg py-3.5 px-6 rounded-2xl shadow-2xl flex items-center justify-center gap-2 border border-neutral-800 transition-all"
            >
              <span>Search Available Rides</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearchPanel;
