[4:00 AM, 1/11/2025] Aryan Kadam Kankavli: import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';

const EventCard = ({ event }) => {
  const [userStatus, setUserStatus] = useState('');
  const [userAuraPoints, setUserAuraPoints] = useState(0);
  const [minAuraPointsRequired, setMinAuraPointsRequired] = useState(Number(event?.auraPointsRequired) || 0);
  const [userData, setUserData] = useState(null);
  const [promotions, setPromotions] = useState(event.promotions || 0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventAndUserDetails = async () => {
      if (!auth.currentUser || !event?.id) return;

      try {
        const eventDocRef = doc(db, 'events', event.id);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        const [eventSnap, userSnap] = await Promise.all([
          getDoc(eventDocRef),
          getDoc(userDocRef),
        ]);

        if (eventSnap.exists()) {
          const eventData = eventSnap.data();
          setMinAuraPointsRequired(Number(eventData.auraPointsRequired) || 0);
          
          // Check if user is already participating
          if (eventData.participants?.includes(auth.currentUser.uid)) {
            setUserStatus('accepted');
          }
        }

        if (userSnap.exists()) {
          const userDataFromDB = userSnap.data();
          setUserData(userDataFromDB);
          setUserAuraPoints(Number(userDataFromDB.auraPoints || 0));
        }
      } catch (error) {
        console.error('Error fetching event or user details:', error);
      }
    };

    fetchEventAndUserDetails();
  }, [event]);

  const handleParticipate = async () => {
    if (!auth.currentUser || !event?.id) return;

    if (userStatus === 'accepted') {
      alert("You're already participating in this event!");
      return;
    }

    if (userAuraPoints < minAuraPointsRequired) {
      alert(You need at least ${minAuraPointsRequired} Aura Points to join this event. You currently have ${userAuraPoints} points.);
      return;
    }

    try {
      const eventDocRef = doc(db, 'events', event.id);
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      // Get current user data
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        throw new Error('User data not found');
      }

      const currentUserData = userSnap.data();
      
      // Calculate new values
      const newAuraPoints = Number((currentUserData.auraPoints || 0) + 0.5).toFixed(1);
      const newParticipatedEvents = (currentUserData.participatedEvents || 0) + 1;

      // Update both event and user documents
      await Promise.all([
        // Add user to event participants
        updateDoc(eventDocRef, {
          participants: arrayUnion(auth.currentUser.uid)
        }),
        // Update user's aura points and participated events count
        updateDoc(userDocRef, {
          auraPoints: Number(newAuraPoints),
          participatedEvents: newParticipatedEvents,
          // Add event to user's participated events list if you want to track specific events
          participatedEventIds: arrayUnion(event.id)
        })
      ]);

      // Update local state
      setUserStatus('accepted');
      setUserAuraPoints(Number(newAuraPoints));
      setUserData(prev => ({
        ...prev,
        auraPoints: Number(newAuraPoints),
        participatedEvents: newParticipatedEvents
      }));

      alert(`Successfully joined the event! 
      • Earned 0.5 Aura Points
      • New total: ${newAuraPoints} points
      • Events participated: ${newParticipatedEvents}`);

    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join the event. Please try again.');
    }
  };

  const handlePromote = async () => {
    if (!auth.currentUser) {
      alert('Please login to promote events');
      return;
    }

    try {
      const eventDocRef = doc(db, 'events', event.id);
      await updateDoc(eventDocRef, {
        promotions: increment(1)
      });
      setPromotions(prev => prev + 1);
    } catch (error) {
      console.error('Error promoting event:', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6"
    >
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-800">
          {event.title || 'Untitled Event'}
        </h3>

        <p className="text-gray-600 leading-relaxed">
          {event.description || 'No description provided.'}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-gray-500">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{event.location || 'Not specified'}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>{event.time || 'Not specified'}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <UsersIcon className="h-5 w-5 mr-2" />
            <span>Max Volunteers: {event.maxVolunteers || 'Unlimited'}</span>
          </div>

          <div className="flex items-center text-gray-500">
            <StarIcon className="h-5 w-5 mr-2" />
            <span>Required Aura Points: {minAuraPointsRequired}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePromote}
            className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
          >
            <HeartIcon className="h-5 w-5" />
            <span>{promotions} Promotes</span>
          </button>
          
          <button
            onClick={handleParticipate}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
              userAuraPoints >= minAuraPointsRequired && userStatus !== 'accepted'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
            disabled={userAuraPoints < minAuraPointsRequired || userStatus === 'accepted'}
          >
            {userStatus === 'accepted'
              ? '✓ Joined'
              : userAuraPoints >= minAuraPointsRequired
              ? 'Join Event'
              : Need ${minAuraPointsRequired} Points}
          </button>

          {userStatus === 'accepted' && (
            <div
              className="flex items-center cursor-pointer text-blue-500 hover:text-blue-600"
              onClick={() => navigate(/chat)}
            >
              <FaComments size={20} />
              <span className="ml-2 font-medium">Chat</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    description: PropTypes.string,
    location: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    maxVolunteers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    hostedBy: PropTypes.string,
    auraPointsRequired: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

export default EventCard;
[4:01 AM, 1/11/2025] Aryan Kadam Kankavli: .......cardGene
[4:01 AM, 1/11/2025] Aryan Kadam Kankavli: import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { GlareCard } from './GlareCard';

const CardGenerator = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 pt-20">
      <h1 className="text-3xl font-bold mb-8">Your Volunteer Card</h1>
      <div className="w-full max-w-md">
        <GlareCard user={userData} />
      </div>
    </div>
  );
};

export default CardGenerator;