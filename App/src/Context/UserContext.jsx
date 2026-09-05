/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

// Create User Data Context
export const UserDataContext = createContext(null);

// Custom hook to consume User Context easily
export const useUser = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUser must be used within a UserContextProvider');
  }
  return context;
};

const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    phoneNumber: '',
  });

  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const loginUser = (userData) => {
    setUser({
      firstName: userData.FirstName || userData.firstName || '',
      lastName: userData.LastName || userData.lastName || '',
      emailId: userData.EmailId || userData.emailId || userData.email || '',
      phoneNumber: userData.PhoneNumber || userData.phoneNumber || '',
    });
    setIsUserAuthenticated(true);
  };

  const logoutUser = () => {
    setUser({
      firstName: '',
      lastName: '',
      emailId: '',
      phoneNumber: '',
    });
    setIsUserAuthenticated(false);
  };

  return (
    <UserDataContext.Provider
      value={{
        user,
        setUser,
        isUserAuthenticated,
        setIsUserAuthenticated,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContextProvider;
