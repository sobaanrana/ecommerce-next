export const getSignedUserData = async (token: string) => {
  console.log("getSignedUserData");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/user`,
      {
        method: "GET", // Make sure the method is GET
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the JWT token in Authorization header
        },
        credentials: "include", // Ensure cookies are sent with the request
      }
    );

    // Check if the response is ok (status code 200-299)
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    // Parse JSON response correctly
    const data = await response.json();
    const user = data.user; // Access the user object from the response

    console.log(user);
    return user;
  } catch (err) {
    console.error("Error fetching user data:", err.message);
    throw err; // Re-throw the error to be handled in the calling component or function
  }
};
