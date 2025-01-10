import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import Navbar from "./components/Navbar";
import SmoothScroll from './components/SmoothScroll';
import ScrollToTop from './components/ScrollToTop';

// Lazy load components
const Home = React.lazy(() => import("./components/Home"));
const Register = React.lazy(() => import("./components/Register"));
const Login = React.lazy(() => import("./components/Login"));
const BrowseEvents = React.lazy(() => import("./components/BrowseEvents"));
const HostAnEvent = React.lazy(() => import("./components/HostAnEvent"));
const Profile = React.lazy(() => import("./components/Profile"));
const ChatPage = React.lazy(() => import("./components/ChatPage"));
const Leaderboard = React.lazy(() => import("./components/Leaderboard"));

const App = () => {
  return (
    <Router>
      <SmoothScroll>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
          <Navbar />
          <Suspense fallback={<LoadingSpinner />}>
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
                <Route path="/events/:eventId/chat" element={<ChatPage />} />
              </Routes>
            </div>
          </Suspense>
          <ScrollToTop />
        </div>
      </SmoothScroll>
    </Router>
  );
};

export default App;