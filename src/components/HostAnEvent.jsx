import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure correct Firebase configuration import
import { useNavigate } from 'react-router-dom';

const HostAnEvent = () => {
  const [eventData, setEventData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxVolunteers: '',
    hostedBy: '',
    auraPointsRequired: '', // Ensure it starts as an empty string or a valid number
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure maxVolunteers is a valid number
    const maxVolunteers = parseInt(eventData.maxVolunteers, 10);

    if (isNaN(maxVolunteers) || maxVolunteers <= 0) {
      alert('Please enter a valid number for Max Volunteers.');
      return;
    }

    // Ensure auraPointsRequired is a valid number
    const auraPointsRequired = parseInt(eventData.auraPointsRequired, 10);

    if (isNaN(auraPointsRequired) || auraPointsRequired < 0) {
      alert('Please enter a valid number for Aura Points Required.');
      return;
    }

    // Prepare the event data
    const newEventData = {
      ...eventData,
      participants: [], // Initialize participants as an empty array
      maxVolunteers,
      auraPointsRequired, // Ensure this value is included in the event data
    };

    try {
      // Add event data to Firestore
      await addDoc(collection(db, 'events'), newEventData);
      console.log('Event hosted successfully');

      // Redirect to Browse Events page after successful submission
      navigate('/browse-events');
    } catch (error) {
      console.error('Error hosting event: ', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Host an Event</h1>
        <form onSubmit={handleSubmit}>
          {/* Event Title */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Event Title"
              required
            />
          </div>

          {/* Event Date */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Event Time */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Time</label>
            <input
              type="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              required
            />
          </div>

          {/* Event Location */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Event Location"
              required
            />
          </div>

          {/* Event Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Describe the event"
              required
            />
          </div>

          {/* Max Volunteers */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Max Volunteers</label>
            <input
              type="number"
              name="maxVolunteers"
              value={eventData.maxVolunteers}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Max Volunteers"
              required
            />
          </div>

          {/* Hosted By */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Hosted By</label>
            <input
              type="text"
              name="hostedBy"
              value={eventData.hostedBy}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Host Name"
              required
            />
          </div>

          {/* Aura Points Required */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">How many Aura Points must a participant have?</label>
            <input
              type="number"
              name="auraPointsRequired"
              value={eventData.auraPointsRequired}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Aura Points Required"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default HostAnEvent;
