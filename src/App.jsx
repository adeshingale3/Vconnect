import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login"; // Assuming Login.jsx exists
import BrowseEvent from "./components/BrowseEvent";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/browse-event" element={<BrowseEvent/>}/>
      </Routes>
    </Router>
  );
};

export default App;
