import { useState } from 'react';
import { addDoc, collection, doc, updateDoc, increment } from 'firebase/firestore';
import { db, auth } from '../firebase';
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
    auraPointsRequired: '0',
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

    // Convert to numbers and validate
    const auraPointsRequired = Number(eventData.auraPointsRequired);
    const maxVolunteers = Number(eventData.maxVolunteers);

    if (isNaN(auraPointsRequired) || auraPointsRequired < 0) {
      alert('Please enter a valid number for Aura Points Required.');
      return;
    }

    if (isNaN(maxVolunteers) || maxVolunteers <= 0) {
      alert('Please enter a valid number for Max Volunteers.');
      return;
    }

    const newEventData = {
      ...eventData,
      participants: [],
      maxVolunteers: maxVolunteers,
      auraPointsRequired: auraPointsRequired,
      createdAt: new Date(),
      hostId: auth.currentUser.uid,
    };

    try {
      const docRef = await addDoc(collection(db, 'events'), newEventData);
      console.log('Event hosted successfully with ID:', docRef.id);
      
      // Update host's hostedEvents count
      const userRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userRef, {
        hostedEvents: increment(1)
      });

      navigate('/browse-events');
    } catch (error) {
      console.error('Error hosting event: ', error);
      alert('Failed to create event. Please try again.');
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
