import React, { createContext, useState } from "react";

// Create context
export const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    userId: null,
    userType: "",
    sysAdmin: false,
  });

  const login = (id) => {
    setUser({
      isLoggedIn: true,
      userId: id,
      userType: "teacher",
      sysAdmin: false,
    });
  };

  const logout = () => {
    setUser({
      isLoggedIn: false,
      userId: null,
      userType: "",
      sysAdmin: false,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
