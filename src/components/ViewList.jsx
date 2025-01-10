import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

const ViewList = ({ participants, eventId, handleAccept, handleReject }) => {
  const [participantNames, setParticipantNames] = useState([]);

  useEffect(() => {
    const fetchParticipantNames = async () => {
      const eventRef = doc(db, 'events', eventId);
      const eventSnap = await getDoc(eventRef);
      if (eventSnap.exists()) {
        setParticipantNames(eventSnap.data().participantsNames || []);
      }
    };

    fetchParticipantNames();
  }, [eventId, participants]);

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-2">Participants List</h3>
      {participantNames.length > 0 ? (
        participantNames.map((name, index) => (
          <div key={index} className="flex justify-between items-center mb-2">
            <span>{name}</span>
          </div>
        ))
      ) : (
        <p>No participants yet.</p>
      )}
    </div>
  );
};

export default ViewList;
