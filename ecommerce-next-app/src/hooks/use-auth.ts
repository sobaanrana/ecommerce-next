import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "./context/userContext";

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // Store error messages here
  //   const [user, setUser] = useState<object | null>(null);

  const { user, setUser } = useUser(); // Access the user state and setUser function from context
  const router = useRouter();

  const signOut = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent with the request
      });

      const data = await response.json();

      if (response.ok) {
        // Handle the successful logout
        console.log(data.message); // Optionally log the message
        setUser(null); // Clear user data after successful logout
        setError(null); // Clear error if logout is successful
        document.cookie = `${"token"}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;

        router.push("/sign-in");
      } else {
        console.log(data.message); // Handle failure if any
        setError(data.message || "Logout failed.");
      }
    } catch (error) {
      console.log("Logout failed", error.message);
      setError("Logout failed due to an error.");
    } finally {
      setLoading(false); // Ensure loading is set to false after the API call
    }
  };

  const getSignedUserData = async () => {
    // Client-side method to get cookies
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
      return null;
    };

    // Usage
    const token = getCookie("token"); // Access the token from cookies

    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      setLoading(true);

      const response = await fetch("http://localhost:4000/api/auth/user", {
        method: "GET", // Make sure the method is GET
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token in Authorization header
        },
        credentials: "include", // Ensure cookies are sent with the request
      });

      // Check if the response is ok (status code 200-299)
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      // Parse JSON response correctly
      const data = await response.json();
      const user = data.user; // Access the user object from the response
      setLoading(false);
      setUser(user);
      console.log(user, "user data");
    } catch (err) {
      console.log("Error fetching user data:", err.message);
      setLoading(false);
      setError("Error fetching user data.");
    }
  };

  return {
    user,
    loading,
    error,
    getSignedUserData,
    signOut,
  };
};
