import React, { createContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    userId: null,
  });

  // Function to log in a user
  const login = (id) => {
    setUser({
      isLoggedIn: true,
      userId: id,
    });
  };

  // Function to log out a user
  const logout = () => {
    setUser({
      isLoggedIn: false,
      userId: null,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
