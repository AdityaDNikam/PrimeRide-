import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCaptain } from '../context/CaptainContext';
import axiosInstance from '../services/axios';

/**
 * CaptainProtectWrapper
 * Protected route wrapper that verifies the captain JWT token by fetching 
 * driver details asynchronously from DB via GET /api/v1/captains/profile.
 */
const CaptainProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { setCaptain, setIsCaptainAuthenticated } = useCaptain();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/captain-login');
      return;
    }

    const fetchCaptainProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/captains/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const captainData = response.data?.data;
          if (captainData) {
            const details = captainData.Caption_Details || {};
            const vehicle = captainData.Vehicle || {};

            setCaptain({
              firstName: details.First_Name || '',
              lastName: details.Last_Name || '',
              emailId: details.EmailId || details.Email || '',
              phoneNumber: details.PhoneNumber || details.Number || '',
              registrationNum: vehicle.Regrestration_Num || '',
              color: vehicle.Color || '',
              capacity: vehicle.Capacity || '',
              vehicleType: vehicle.VehicleType || '',
            });
            setIsCaptainAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Captain token verification error:', error);
        localStorage.removeItem('token');
        setIsCaptainAuthenticated(false);
        navigate('/captain-login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaptainProfile();
  }, [token, navigate, setCaptain, setIsCaptainAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white font-['Outfit',sans-serif]">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-neutral-400 font-medium tracking-wide">Authenticating Captain...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectWrapper;
