import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../services/axios';

/**
 * UserProtectWrapper
 * Protected route wrapper that verifies the user JWT token by fetching 
 * user details asynchronously from DB via GET /api/v1/users/profile.
 */
const UserProtectWrapper = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { setUser, setIsUserAuthenticated } = useUser();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const userData = response.data?.data;
          if (userData) {
            setUser({
              firstName: userData.FirstName || '',
              lastName: userData.LastName || '',
              emailId: userData.EmailId || '',
              phoneNumber: userData.PhoneNumber || '',
            });
            setIsUserAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Token verification error:', error);
        localStorage.removeItem('token');
        setIsUserAuthenticated(false);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [token, navigate, setUser, setIsUserAuthenticated]);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-black flex flex-col items-center justify-center text-white font-['Outfit',sans-serif]">
        <div className="w-8 h-8 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-xs text-neutral-400 font-medium tracking-wide">Authenticating Rider...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
