import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    userId: null,
    userType: "student",
    sysAdmin: false,
    name: "",
  });

  // 🔄 Listen for Firebase login/logout automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.email.split("@")[0];
        setUser({
          isLoggedIn: true,
          userId: firebaseUser.uid,
          userType: "student",
          sysAdmin: false,
          name,
        });
      } else {
        setUser({
          isLoggedIn: false,
          userId: null,
          userType: "student",
          sysAdmin: false,
          name: "",
        });
      }
    });

    return unsubscribe; // cleanup listener
  }, []);

  // Manual login (optional, still used after Firebase login)
  const login = (id, email) => {
    const name = email.split("@")[0];
    setUser({
      isLoggedIn: true,
      userId: id,
      email: email,
      userType: "student",
      sysAdmin: false,
      name,
    });
  };

  // Proper Firebase logout
  const logout = async () => {
    await signOut(auth);
    setUser({
      isLoggedIn: false,
      userId: null,
      userType: "student",
      sysAdmin: false,
      name: "",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
