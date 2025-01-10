import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Import Firebase Firestore
import { collection, getDocs } from 'firebase/firestore';
import EventCard from './EventCard'; // Card component to display event


const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [titleSearch, setTitleSearch] = useState(''); // State for title search
  const [citySearch, setCitySearch] = useState(''); // State for city search
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, 'events');
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map(doc => doc.data());
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Filter events based on search input
    const filtered = events.filter((event) => {
      const isTitleMatch = event.title.toLowerCase().includes(titleSearch.toLowerCase());
      const isCityMatch = event.location.toLowerCase().includes(citySearch.toLowerCase());

      return isTitleMatch || isCityMatch;
    });

    setFilteredEvents(filtered);
  }, [titleSearch, citySearch, events]);

  // Function to check if the event is over
  const isEventOver = (eventDate) => {
    const currentDate = new Date();
    const eventEndDate = new Date(eventDate); // Assuming eventDate is in ISO string format or timestamp
    return eventEndDate < currentDate;
  };

  const handleTitleSearch = (e) => {
    setTitleSearch(e.target.value);
  };

  const handleCitySearch = (e) => {
    setCitySearch(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-6">Browse Events</h1>

        {/* Search Bar Section */}
        <div className="flex gap-4 mb-6 justify-center">
          {/* Title Search */}
          <div className="flex items-center">
            <input
              type="text"
              value={titleSearch}
              onChange={handleTitleSearch}
              className="border rounded-lg px-4 py-2"
              placeholder="Search by Event Title"
            />
            <button
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => {}}
            >
              Search
            </button>
          </div>

          {/* City Search */}
          <div className="flex items-center">
            <input
              type="text"
              value={citySearch}
              onChange={handleCitySearch}
              className="border rounded-lg px-4 py-2"
              placeholder="Search by City"
            />
            <button
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              onClick={() => {}}
            >
              Search
            </button>
          </div>
        </div>

        {/* Display Filtered Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                isEventOver(event.date) ? 'bg-red-500' : 'bg-white'
              }`}
            >
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;
