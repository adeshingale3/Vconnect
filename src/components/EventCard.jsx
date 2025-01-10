import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { db, auth } from '../firebase'; // Firebase Firestore and Authentication
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const EventCard = ({ event }) => {
  const [userStatus, setUserStatus] = useState('');
  const [userAuraPoints, setUserAuraPoints] = useState(10);
  const [minAuraPointsRequired, setMinAuraPointsRequired] = useState(Number(event?.auraPointsRequired) || 0);

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

          if (eventData.participants && Array.isArray(eventData.participants)) {
            setUserStatus(eventData.participants.includes(auth.currentUser.uid) ? 'accepted' : '');
          }
        }

        if (userSnap.exists()) {
          const userDataFromDB = userSnap.data();
          setUserAuraPoints(Number(userDataFromDB.auraPoints ?? 10));
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
      alert("You're already participating!");
      return;
    }

    if (userAuraPoints < minAuraPointsRequired) {
      alert(`You need at least ${minAuraPointsRequired} Aura Points to join this event. You currently have ${userAuraPoints} points.`);
      return;
    }

    try {
      const eventDocRef = doc(db, 'events', event.id);
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      // Update the event and user in Firestore
      const newAuraPoints = userAuraPoints + 0.5;

      await Promise.all([
        updateDoc(eventDocRef, {
          participants: arrayUnion(auth.currentUser.uid),
        }),
        updateDoc(userDocRef, {
          auraPoints: newAuraPoints,
        }),
      ]);

      // Update local state
      setUserStatus('accepted');
      setUserAuraPoints(newAuraPoints);

      alert('You have successfully joined the event! Earned 0.5 Aura Points.');
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Successfully Joined the Event.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-16">
      <h3 className="text-2xl font-bold mb-2">{event.title || 'Untitled Event'}</h3>
      <p className="text-gray-700 mb-2">{event.description || 'No description provided.'}</p>
      <p className="text-gray-600">Location: {event.location || 'Not specified'}</p>
      <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString() || 'Not specified'}</p>
      <p className="text-gray-600">Time: {event.time || 'Not specified'}</p>
      <p className="text-gray-600">Max Volunteers: {event.maxVolunteers || 'Unlimited'}</p>
      <p className="text-gray-600">Hosted by: {event.hostedBy || 'Unknown'}</p>
      <p className="text-gray-600">Required Aura Points: {minAuraPointsRequired}</p>

      <button
        onClick={handleParticipate}
        className={`mt-4 font-bold py-2 px-4 rounded-lg transition duration-200 ${
          userAuraPoints >= minAuraPointsRequired && userStatus !== 'accepted'
            ? 'bg-green-500 text-white hover:bg-green-600'
            : 'bg-gray-400 text-gray-700 cursor-not-allowed'
        }`}
        disabled={userAuraPoints < minAuraPointsRequired || userStatus === 'accepted'}
      >
        {userStatus === 'accepted'
          ? 'Joined'
          : userAuraPoints >= minAuraPointsRequired
          ? 'Join Event'
          : `Need ${minAuraPointsRequired} Aura Points`}
      </button>
    </div>
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
