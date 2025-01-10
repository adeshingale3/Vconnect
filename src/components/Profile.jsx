// src/components/Profile.jsx
import { useState, useEffect } from 'react';
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { GlareCard } from './GlareCard';
import html2canvas from 'html2canvas';

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
  });

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }

    let unsubscribe;

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
          });
        }

        unsubscribe = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            setUserData({
              ...data,
              auraPoints: Number(data.auraPoints ?? 10),
              participatedEvents: Number(data.participatedEvents || 0),
              hostedEvents: Number(data.hostedEvents || 0),
            });
          }
        });

      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
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
        name: formData.name,
        nickname: formData.nickname,
        bio: formData.bio,
      });

      setEditMode(false);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDownloadVCard = async () => {
    const cardElement = document.getElementById("vcard");
    if (cardElement) {
      try {
        // Create a temporary container with black background
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        tempContainer.style.background = '#000';
        tempContainer.style.padding = '0';
        
        // Clone the card and remove any margins
        const cardClone = cardElement.cloneNode(true);
        cardClone.style.margin = '0';
        cardClone.style.maxWidth = 'none';
        tempContainer.appendChild(cardClone);
        document.body.appendChild(tempContainer);

        // Capture the card
        const canvas = await html2canvas(cardClone, {
          backgroundColor: null,
          scale: 2, // Higher quality
          logging: false,
          useCORS: true,
          allowTaint: true,
          removeContainer: true,
        });

        // Create download link
        const link = document.createElement("a");
        link.href = canvas.toDataURL('image/png');
        link.download = `${userData.name || 'volunteer'}_vcard.png`;
        link.click();

        // Cleanup
        document.body.removeChild(tempContainer);
      } catch (error) {
        console.error('Error generating card:', error);
      }
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mt-16">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Profile</h3>
        <button
          onClick={() => setShowVCard(!showVCard)}
          className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition duration-200"
        >
          {showVCard ? 'Hide VCard' : 'Show VCard'}
        </button>
      </div>

      {showVCard && (
        <div className="mb-8">
          <div id="vcard" className="mb-4">
            <GlareCard user={userData} />
          </div>
          <button
            onClick={handleDownloadVCard}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Download VCard
          </button>
        </div>
      )}

      <div className="mt-4">
        <div className="mb-4">
          <span className="font-semibold">Name: </span>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded p-2"
            />
          ) : (
            <span>{userData.name || "Not set"}</span>
          )}
        </div>

        <div className="mb-4">
          <span className="font-semibold">Nickname: </span>
          {editMode ? (
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="border rounded p-2"
            />
          ) : (
            <span>{userData.nickname || "Not set"}</span>
          )}
        </div>

        <div className="mb-4">
          <span className="font-semibold">Bio: </span>
          {editMode ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border rounded p-2 w-full"
            />
          ) : (
            <span>{userData.bio || "No bio provided"}</span>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div>
            <p>
              <span className="font-semibold">Participated Events: </span>
              {userData.participatedEvents}
            </p>
            <p>
              <span className="font-semibold">Hosted Events: </span>
              {userData.hostedEvents}
            </p>
            <p>
              <span className="font-semibold">Aura Points: </span>
              {userData.auraPoints}
            </p>
          </div>

          <div>
            {editMode ? (
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Save
              </button>
            ) : (
              <button
                onClick={handleEditToggle}
                className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;