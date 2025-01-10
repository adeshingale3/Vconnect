import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import EventCard from './EventCard';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import LoadingSpinner from './LoadingSpinner';

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [filteredEvents, setFilteredEvents] = useState({
    upcoming: [],
    ongoing: [],
    past: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        const eventsCollection = collection(db, 'events');
        const eventSnapshot = await getDocs(eventsCollection);
        
        if (!eventSnapshot.empty) {
          const eventList = eventSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            promotions: doc.data().promotions || 0,
            auraPointsRequired: Number(doc.data().auraPointsRequired) || 0,
            date: doc.data().date || new Date().toISOString(),
            location: doc.data().location || 'Location not specified'
          }));

          // Extract unique cities
          const uniqueCities = [...new Set(eventList.map(event => event.location))].filter(Boolean);
          setCities(uniqueCities.sort());
          
          setEvents(eventList);
          categorizeEvents(eventList);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const categorizeEvents = (eventList) => {
    const now = new Date();
    const categorized = eventList.reduce((acc, event) => {
      const eventDate = new Date(event.date);
      if (eventDate < now) {
        acc.past.push(event);
      } else if (eventDate.toDateString() === now.toDateString()) {
        acc.ongoing.push(event);
      } else {
        acc.upcoming.push(event);
      }
      return acc;
    }, { upcoming: [], ongoing: [], past: [] });

    // Sort each category by date
    categorized.upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    categorized.ongoing.sort((a, b) => new Date(a.date) - new Date(b.date));
    categorized.past.sort((a, b) => new Date(b.date) - new Date(a.date)); // Past events newest first

    setFilteredEvents(categorized);
  };

  const handleCityFilter = (city) => {
    setSearchCity(city);
    if (city && city.trim() !== '') {
      const filtered = events.filter(event => 
        event.location.toLowerCase().includes(city.toLowerCase())
      );
      categorizeEvents(filtered);
    } else {
      categorizeEvents(events);
    }
  };

  const EventSection = ({ title, events, className = "" }) => (
    events.length > 0 && (
      <div className={`mb-12 ${className}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    )
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-20"
    >
      <div className="container mx-auto px-4 py-8">
        {/* City Filter Section */}
        <div className="mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchCity}
                  onChange={(e) => handleCityFilter(e.target.value)}
                  placeholder="Search by city..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* City Pills */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleCityFilter('')}
                  className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                    !searchCity 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Cities
                </button>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCityFilter(city)}
                    className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                      searchCity === city
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Events Sections */}
        <EventSection title="Upcoming Events" events={filteredEvents.upcoming} />
        <EventSection title="Ongoing Events" events={filteredEvents.ongoing} />
        <EventSection title="Past Events" events={filteredEvents.past} className="opacity-75" />

        {/* No Events Message */}
        {Object.values(filteredEvents).every(arr => arr.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
  {searchCity
    ? `No events found in "${searchCity}"`
    : "No events available at the moment"}
</p>

          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BrowseEvents;