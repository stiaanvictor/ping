import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    userId: null,
    userType: "",
    sysAdmin: false,
    name: "",
  });

  // 🔄 Listen for Firebase login/logout automatically
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const name = firebaseUser.email.split("@")[0];

        // Fetch user info from Firestore
        try {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", firebaseUser.email));
          const querySnapshot = await getDocs(q);

          let userType = "teacher"; // fallback
          let userId;
          if (!querySnapshot.empty) {
            const userSnap = querySnapshot.docs[0];
            const userDoc = userSnap.data();
            userType = userDoc.userType || "student";
            userId = userSnap.id;
          }

          setUser({
            isLoggedIn: true,
            userId: userId,
            userType,
            sysAdmin: false,
            name,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser({
          isLoggedIn: false,
          userId: null,
          userType: "",
          sysAdmin: false,
          name: "",
        });
      }
    });

    return unsubscribe;
  }, []);

  // Manual login (optional)
  const login = async (email) => {
    const name = email.split("@")[0];

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      let userType = "teacher"; // fallback if not found
      let userId;
      if (!querySnapshot.empty) {
        const userSnap = querySnapshot.docs[0];
        const userDoc = userSnap.data();
        userType = userDoc.userType || "student";
        userId = userSnap.id;
      }

      setUser({
        isLoggedIn: true,
        userId: userId,
        email,
        userType,
        sysAdmin: false,
        name,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser({
        isLoggedIn: true,
        userId: id,
        email,
        userType: "teacher",
        sysAdmin: false,
        name,
      });
    }
  };

  // Proper Firebase logout
  const logout = async () => {
    await signOut(auth);
    setUser({
      isLoggedIn: false,
      userId: null,
      userType: "",
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
