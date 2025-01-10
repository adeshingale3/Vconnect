import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { FaComments } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarIcon, MapPinIcon, ClockIcon, UsersIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';

const SuccessPopup = ({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
  >
    <div className="flex items-center space-x-2">
      <span>✓</span>
      <span>{message}</span>
    </div>
  </motion.div>
);

const EventCard = ({ event }) => {
  const [userStatus, setUserStatus] = useState('');
  const [userAuraPoints, setUserAuraPoints] = useState(0);
  const [minAuraPointsRequired, setMinAuraPointsRequired] = useState(Number(event?.auraPointsRequired) || 0);
  const [userData, setUserData] = useState(null);
  const [promotions, setPromotions] = useState(event.promotions || 0);
  const [showSuccess, setShowSuccess] = useState(false);
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
    if (!auth.currentUser || !event?.id) {
      alert('Please login to join events');
      return;
    }

    if (userStatus === 'accepted') {
      alert("You're already participating in this event!");
      return;
    }

    if (userAuraPoints < minAuraPointsRequired) {
      alert(`You need at least ${minAuraPointsRequired} Aura Points to join this event. You currently have ${userAuraPoints} points.`);
      return;
    }

    try {
      const eventDocRef = doc(db, 'events', event.id);
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      // Get current event data
      const eventSnap = await getDoc(eventDocRef);
      if (!eventSnap.exists()) {
        throw new Error('Event not found');
      }

      const eventData = eventSnap.data();
      const currentParticipants = eventData.participants || [];

      // Get current user data
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        throw new Error('User data not found');
      }

      const currentUserData = userSnap.data();
      const newAuraPoints = Number((currentUserData.auraPoints || 0) + 0.5).toFixed(1);
      const newParticipatedEvents = (currentUserData.participatedEvents || 0) + 1;

      // Update user document first
      await updateDoc(userDocRef, {
        auraPoints: Number(newAuraPoints),
        participatedEvents: newParticipatedEvents,
        participatedEventIds: arrayUnion(event.id)
      });

      // Then update event document
      await updateDoc(eventDocRef, {
        participants: [...currentParticipants, auth.currentUser.uid]
      });

      // Update local state
      setUserStatus('accepted');
      setUserAuraPoints(Number(newAuraPoints));
      setUserData(prev => ({
        ...prev,
        auraPoints: Number(newAuraPoints),
        participatedEvents: newParticipatedEvents
      }));

      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);

    } catch (error) {
      console.error('Error joining event:', error);
      let errorMessage = 'Failed to join the event. Please try again.';
      
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to join this event. Please try again later.';
      }
      
      alert(errorMessage);
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
      alert('Failed to promote the event. Please try again later.');
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
          
          {userStatus === 'accepted' ? (
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 bg-green-100 text-green-600 rounded-lg font-medium">
                ✓ Joined
              </span>
              <button
                onClick={() => navigate(`/events/${event.id}/chat`)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaComments size={20} />
                <span>Chat</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleParticipate}
              className={`px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                userAuraPoints >= minAuraPointsRequired
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              disabled={userAuraPoints < minAuraPointsRequired}
            >
              {userAuraPoints >= minAuraPointsRequired
                ? 'Join Event'
                : `Need ${minAuraPointsRequired} Points`}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <SuccessPopup
            message="Successfully joined the event! You earned 0.5 Aura Points."
            onClose={() => setShowSuccess(false)}
          />
        )}
      </AnimatePresence>
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
    promotions: PropTypes.number,
  }).isRequired,
};

export default EventCard;