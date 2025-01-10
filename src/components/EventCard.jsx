import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase'; // Firebase Firestore and Authentication
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const EventCard = ({ event }) => {
  const [userStatus, setUserStatus] = useState('');
  const [userAuraPoints, setUserAuraPoints] = useState(0);
  const [minAuraPointsRequired, setMinAuraPointsRequired] = useState(0);

  useEffect(() => {
    const fetchEventAndUserDetails = async () => {
      if (auth.currentUser) {
        const eventDocRef = doc(db, 'events', event.id);
        const userDocRef = doc(db, 'users', auth.currentUser.uid);

        try {
          const [eventSnap, userSnap] = await Promise.all([
            getDoc(eventDocRef),
            getDoc(userDocRef),
          ]);

          if (eventSnap.exists()) {
            const eventData = eventSnap.data();
            setMinAuraPointsRequired(eventData.minAuraPoints || 0);

            if (eventData.participants?.includes(auth.currentUser.uid)) {
              setUserStatus('accepted');
            }
          }

          if (userSnap.exists()) {
            setUserAuraPoints(userSnap.data().auraPoints || 0);
          }
        } catch (error) {
          console.error('Error fetching event or user details:', error);
        }
      }
    };

    fetchEventAndUserDetails();
  }, [event]);

  const handleParticipate = async () => {
    if (userStatus === 'accepted') {
      alert("You're already participating!");
      return;
    }

    if (userAuraPoints < minAuraPointsRequired) {
      alert('Insufficient aura points to join this event.');
      return;
    }

    const eventDocRef = doc(db, 'events', event.id);
    const userDocRef = doc(db, 'users', auth.currentUser.uid);

    try {
      await Promise.all([
        updateDoc(eventDocRef, {
          participants: arrayUnion(auth.currentUser.uid),
        }),
        updateDoc(userDocRef, {
          auraPoints: userAuraPoints + 0.5,
        }),
      ]);

      setUserStatus('accepted');
      setUserAuraPoints((prev) => prev + 0.5);

      alert('You have successfully joined the event!');
    } catch (error) {
      console.error('Error joining event:', error);
      alert('Failed to join the event.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-2">{event.title || 'Untitled Event'}</h3>
      <p className="text-gray-700 mb-2">{event.description || 'No description provided.'}</p>
      <p className="text-gray-600">Location: {event.location || 'Not specified'}</p>
      <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString() || 'Not specified'}</p>
      <p className="text-gray-600">Time: {event.time || 'Not specified'}</p>
      <p className="text-gray-600">Max Volunteers: {event.maxVolunteers || 'Unlimited'}</p>
      <p className="text-gray-600">Hosted by: {event.hostedBy || 'Unknown'}</p>

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
          : 'Insufficient Aura Points'}
      </button>
    </div>
  );
};

export default EventCard;
