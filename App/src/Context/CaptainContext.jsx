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
    if (!captainData) return;

    const details = captainData.Caption_Details || captainData;
    const vehicle = captainData.Vehicle || captainData;

    setCaptain({
      firstName: details.First_Name || details.firstName || captainData.FirstName || captainData.firstName || '',
      lastName: details.Last_Name || details.lastName || captainData.LastName || captainData.lastName || '',
      emailId: details.EmailId || details.Email || details.emailId || details.email || captainData.EmailId || captainData.Email || '',
      phoneNumber: details.PhoneNumber || details.Number || details.phoneNumber || details.phoneNumber || captainData.PhoneNumber || captainData.Number || '',
      registrationNum: vehicle.Regrestration_Num || vehicle.registrationNum || captainData.Regrestration_Num || '',
      color: vehicle.Color || vehicle.color || captainData.Color || '',
      capacity: vehicle.Capacity || vehicle.capacity || captainData.Capacity || '',
      vehicleType: vehicle.VehicleType || vehicle.vehicleType || captainData.VehicleType || '',
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
