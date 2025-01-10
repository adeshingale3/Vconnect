import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navItems = [
    { name: 'Events', path: '/browse-events' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Host Event', path: '/host-an-event' },
  ];

  return (
    <nav className="fixed w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            VConnect
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.path}
                  className="text-lg font-medium text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  {item.name}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {auth.currentUser ? (
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/profile")}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors text-lg font-medium"
                >
                  Profile
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-red-600 transition-colors text-lg font-medium"
                >
                  Sign Out
                </motion.button>
              </div>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:text-blue-600 transition-colors text-lg font-medium"
                >
                  Login
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/register")}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors text-lg font-medium"
                >
                  Register
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;