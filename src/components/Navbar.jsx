import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase config

const Navbar = () => {
  const [user, setUser] = useState(null); // Track the logged-in user
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the user state based on auth state
    });

    return () => {
      unsubscribe(); // Clean up the listener on component unmount
    };
  }, []);

  const handleRegisterClick = () => {
    navigate("/register");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        navigate("/"); // Redirect to home after signing out
      })
      .catch((error) => console.log("Error signing out:", error));
  };
  const handleHostAnEvent = ()=>{
    navigate("/host-an-event")
  }
  const handleProfileClick = () => {
    navigate("/profile");
  };

  return (
    <div className="h-16 mt-4 fixed w-full flex items-center px-4">
      {/* Logo */}
      <div className="logo text-black font-bold text-xl">Volunteer Connect</div>

      {/* Menu */}
      <div className="menu ml-10 flex gap-6 flex-grow justify-center text-black">
        <a href="#" className="">Event</a>
        <a href="#" className="">Leaderboard</a>
        {/* <a href="#" className="">Host an Event</a> */}
        <button onClick={handleHostAnEvent}>Host an Event</button>
      </div>

      {/* Login, Register, or Profile */}
      <div className="flex gap-6">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-black font-bold"><button onClick={handleProfileClick}>{user.displayName || "Profile"}</button></span>
            <button onClick={handleSignOut} className="text-black">
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <button onClick={handleLoginClick} className="text-black">
              Login
            </button>
            <button onClick={handleRegisterClick} className="text-black">
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
