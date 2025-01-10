import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-2">{event.title}</h3>
      <p className="text-gray-700 mb-2">{event.description}</p>
      <p className="text-gray-600">Location: {event.location}</p>
      <p className="text-gray-600">Date: {new Date(event.date).toLocaleDateString()}</p>
      <p className="text-gray-600">Time: {event.time}</p>
      <p className="text-gray-600">Max Volunteers: {event.maxVolunteers}</p>
      <p className="text-gray-600">Hosted by: {event.hostedBy}</p>
    </div>
  );
};

export default EventCard;
