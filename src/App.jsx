import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import BrowseEvents from "./components/BrowseEvents";
import HostAnEvent from "./components/HostAnEvent";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import ChatPage from "./components/ChatPage";
import Leaderboard from "./components/Leaderboard";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/browse-events" element={<BrowseEvents />} />
          <Route path="/host-an-event" element={<HostAnEvent />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/leaderboard" element={<Leaderboard/>}/>

        </Routes>
      </div>
    </Router>
  );
};

export default App;
