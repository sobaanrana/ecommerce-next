"use client";

// import { getSignedUserData } from "@/lib/getSingedUserData";
// import { cookies } from "next/headers";
import React, { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "../use-auth";
import { getSignedUserData } from "@/lib/getSingedUserData";

// Define the type for the user data
interface UserContextType {
  user: unknown;
  setUser: React.Dispatch<React.SetStateAction<unknown>>;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider component that will wrap your layout or components
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<unknown>(null);
  // Fetch user data when the component mounts
  useEffect(() => {
    // Client-side method to get cookies
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
      return null;
    };

    // Usage
    const token = getCookie("token"); // Access the token from cookies

    const fetchUserData = async () => {
      try {
        if (token) {
          const userData = await getSignedUserData(token); // Fetch user data from the API
          setUser(userData); // Update the user state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null); // Set user to null if there's an error
      }
    };

    fetchUserData(); // Call the function to fetch user data
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context in components
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
