import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login"; // Assuming Login.jsx exists
import BrowseEvent from "./components/BrowseEvent";
import HostAnEvent from "./components/HostAnEvent";
import Profile from "./components/Profile";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse-event" element={<BrowseEvent/>}/>
        <Route path="/host-an-event" element={<HostAnEvent />} />
        <Route path="/browse-events" element={<BrowseEvent />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
