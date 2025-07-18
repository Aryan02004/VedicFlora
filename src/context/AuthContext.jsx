// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add a try-catch block to handle initialization errors
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // User is signed in
            const token = await firebaseUser.getIdToken();
            localStorage.setItem("token", token); // Store token in localStorage

            // Fetch additional user data from Firestore via your API
            try {
              const response = await fetch(
                "http://localhost:5000/api/auth/profile",
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (response.ok) {
                const userData = await response.json();
                // Combine Firebase auth user with custom data
                setUser({
                  ...userData,
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  token,
                });
              } else {
                // If profile fetch fails, still use Firebase user
                setUser({
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  token,
                });
              }
            } catch (profileError) {
              console.error("Error fetching profile:", profileError);
              // Still set the user even if profile fetch fails
              setUser({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                token,
              });
            }
          } else {
            // User is signed out
            localStorage.removeItem("token"); // Clear token on sign out
            setUser(null);
          }
        } catch (error) {
          console.error("Error in authentication state change:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to set up auth state listener:", error);
      setLoading(false);
    }
  }, []);

  // Update your login function to handle errors better
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);
      return { user: userCredential.user, token };
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      throw error; // Rethrow to allow the calling component to handle it
    }
  };

  // Also update your register function to store token
  const register = async (email, password, fullName) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with fullName
      await updateProfile(userCredential.user, { displayName: fullName });

      // Get the ID token
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("token", token);

      // Make an API call to save additional user data in Firestore
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          uid: userCredential.user.uid,
          fullName,
          email,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(
          "Warning: User created in Firebase Auth but may not be fully registered in Firestore",
          errorText
        );
      }

      return { user: userCredential.user, token };
    } catch (error) {
      console.error("Registration error in AuthContext:", error);
      throw error;
    }
  };

  // Implement logout function using Firebase
  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("token"); // Make sure token is removed
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const contextValue = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Move this to a separate file to avoid Fast Refresh warning
export const useAuth = () => useContext(AuthContext);
