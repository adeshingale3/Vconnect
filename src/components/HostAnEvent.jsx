import React, { useState } from 'react';
import { db } from '../firebase'; // Firebase Firestore
import { collection, addDoc } from 'firebase/firestore';
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
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Add event data to Firestore
      await addDoc(collection(db, "events"), eventData);
      console.log("Event hosted successfully");

      // Redirect to Browse Events page after successful submission
      navigate("/browse-events");
    } catch (error) {
      console.error("Error hosting event: ", error);
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
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Date */}
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

          {/* Time */}
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

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Enter event location"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Event Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Describe your event"
              required
            ></textarea>
          </div>

          {/* Max Volunteers */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Max Volunteer Limit</label>
            <input
              type="number"
              name="maxVolunteers"
              value={eventData.maxVolunteers}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Max number of volunteers"
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
              placeholder="Your name"
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
