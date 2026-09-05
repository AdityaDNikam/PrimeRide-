/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

// Create Captain Data Context
export const CaptainDataContext = createContext(null);

// Custom hook to consume Captain Context easily
export const useCaptain = () => {
  const context = useContext(CaptainDataContext);
  if (!context) {
    throw new Error('useCaptain must be used within a CaptainContextProvider');
  }
  return context;
};

const CaptainContextProvider = ({ children }) => {
  const [captain, setCaptain] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
    registrationNum: '',
    color: '',
    capacity: '',
    vehicleType: '',
  });

  const [isCaptainAuthenticated, setIsCaptainAuthenticated] = useState(false);

  const loginCaptain = (captainData) => {
    setCaptain({
      firstName: captainData.FirstName || captainData.firstName || '',
      lastName: captainData.LastName || captainData.lastName || '',
      emailId: captainData.EmailId || captainData.emailId || captainData.email || '',
      phoneNumber: captainData.PhoneNumber || captainData.phoneNumber || '',
      registrationNum: captainData.Regrestration_Num || captainData.registrationNum || '',
      color: captainData.Color || captainData.color || '',
      capacity: captainData.Capacity || captainData.capacity || '',
      vehicleType: captainData.VehicleType || captainData.vehicleType || '',
    });
    setIsCaptainAuthenticated(true);
  };

  const logoutCaptain = () => {
    setCaptain({
      firstName: '',
      lastName: '',
      emailId: '',
      phoneNumber: '',
      registrationNum: '',
      color: '',
      capacity: '',
      vehicleType: '',
    });
    setIsCaptainAuthenticated(false);
  };

  return (
    <CaptainDataContext.Provider
      value={{
        captain,
        setCaptain,
        isCaptainAuthenticated,
        setIsCaptainAuthenticated,
        loginCaptain,
        logoutCaptain,
      }}
    >
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContextProvider;
