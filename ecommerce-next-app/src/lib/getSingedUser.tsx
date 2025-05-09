// src/utils/getSignedUser.ts

export const getSignedUser = async (token) => {
  console.log("getSignIn");
  try {
    const response = await fetch("http://localhost:4000/api/auth/user", {
      headers: {
        "Content-Type": "application/json",
        // You can also manually include the token in headers if needed:
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Ensure cookies are sent with the request
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }

    const user = await response.json();

    console.log(user);
    return user;
  } catch (err) {
    console.log(err.message);
    throw err; // Re-throw the error to be handled in getServerSideProps
  }
};
