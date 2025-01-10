// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { GlareCard } from './GlareCard';
import { motion } from 'framer-motion';
import { CalendarIcon, UsersIcon, StarIcon, HeartIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import { INTEREST_OPTIONS } from '../constants/interests';

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    bio: "",
    participatedEvents: 0,
    hostedEvents: 0,
    auraPoints: 10,
  });

  const [editMode, setEditMode] = useState(false);
  const [showVCard, setShowVCard] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    bio: "",
    interests: []
  });

  const [hostedEvents, setHostedEvents] = useState([]);
  const [participatedEvents, setParticipatedEvents] = useState([]);

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            ...data,
            auraPoints: Number(data.auraPoints ?? 10),
            participatedEvents: Number(data.participatedEvents || 0),
            hostedEvents: Number(data.hostedEvents || 0),
          });
          setFormData({
            name: data.name || "",
            nickname: data.nickname || "",
            bio: data.bio || "",
            interests: data.interests || []
          });

          // Fetch hosted events
          const hostedEventsQuery = query(
            collection(db, 'events'),
            where('hostedBy', '==', auth.currentUser.uid)
          );
          const hostedSnap = await getDocs(hostedEventsQuery);
          const hostedData = hostedSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            participantsCount: doc.data().participants?.length || 0
          }));
          setHostedEvents(hostedData);

          // Fetch participated events
          if (data.participatedEventIds) {
            const participatedData = await Promise.all(
              data.participatedEventIds.map(async (eventId) => {
                const eventDoc = await getDoc(doc(db, 'events', eventId));
                return { id: eventId, ...eventDoc.data() };
              })
            );
            setParticipatedEvents(participatedData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    if (!auth.currentUser) return;

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        ...formData,
        interests: formData.interests || []
      });
      setUserData(prev => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDownloadVCard = async () => {
    const cardElement = document.getElementById("vcard");
    if (!cardElement) return;

    try {
      // Create a temporary container with white background
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '0';
      tempContainer.style.left = '-9999px';
      tempContainer.style.background = 'white';
      tempContainer.style.width = '300px'; // Fixed width for the card
      tempContainer.style.padding = '20px';
      
      // Clone the card
      const cardClone = cardElement.cloneNode(true);
      cardClone.style.margin = '0';
      cardClone.style.width = '100%';
      tempContainer.appendChild(cardClone);
      document.body.appendChild(tempContainer);

      // Capture the card
      const canvas = await html2canvas(cardClone, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: 300,
        height: cardClone.offsetHeight,
      });

      // Create and trigger download
      const link = document.createElement("a");
      link.download = `${userData.name || 'volunteer'}_vcard.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Cleanup
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Failed to download card. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-6">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "?"}
              </div>
              <div>
                {editMode ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      placeholder="Nickname (optional)"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {userData.name || "Anonymous"}
                      {userData.nickname && (
                        <span className="text-lg text-gray-500 ml-2">({userData.nickname})</span>
                      )}
                    </h1>
                    <p className="text-gray-600 mt-1">{userData.bio || "No bio yet"}</p>
                  </>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              {editMode ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowVCard(!showVCard)}
                    className="px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                  >
                    {showVCard ? "Hide VCard" : "Show VCard"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-blue-600 font-semibold">Aura Points</h3>
              <p className="text-2xl font-bold">{userData.auraPoints.toFixed(1)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-green-600 font-semibold">Events Hosted</h3>
              <p className="text-2xl font-bold">{userData.hostedEvents}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="text-purple-600 font-semibold">Events Joined</h3>
              <p className="text-2xl font-bold">{userData.participatedEvents}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-red-600 font-semibold">Impact Score</h3>
              <p className="text-2xl font-bold">
                {(userData.participatedEvents * 10 + userData.hostedEvents * 20).toFixed(0)}
              </p>
            </div>
          </div>

          {!editMode && userData.interests?.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {userData.interests.map((interestId) => {
                  const interest = INTEREST_OPTIONS.find(opt => opt.id === interestId);
                  return interest ? (
                    <span
                      key={interestId}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {interest.label}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}

          {editMode && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
              <div className="grid grid-cols-2 gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <label
                    key={interest.id}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.interests?.includes(interest.id)}
                      onChange={() => {
                        const newInterests = formData.interests?.includes(interest.id)
                          ? formData.interests.filter(id => id !== interest.id)
                          : [...(formData.interests || []), interest.id];
                        setFormData(prev => ({ ...prev, interests: newInterests }));
                      }}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{interest.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VCard Section */}
        {showVCard && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <div id="vcard" className="w-full max-w-sm mx-auto">
              <GlareCard user={userData} />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleDownloadVCard}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Download VCard
              </button>
            </div>
          </div>
        )}

        {/* Hosted Events Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Events You're Hosting</h2>
          {hostedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostedEvents.map(event => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <span>{event.participants?.length || 0} Participants</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">You haven't hosted any events yet.</p>
          )}
        </div>

        {/* Participated Events Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Events You've Joined</h2>
          {participatedEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {participatedEvents.map(event => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-gray-50 p-6 rounded-lg shadow-sm"
                >
                  <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      <span>{event.participants?.length || 0} Participants</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center">You haven't joined any events yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;