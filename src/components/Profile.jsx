import { useState, useEffect } from 'react';
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

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

        // Fetch user data from Firestore
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched data:", data); // Debugging fetched data
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
        } else {
          // Create default user data if not exists
          const defaultData = {
            name: "",
            nickname: "",
            bio: "",
            participatedEvents: 0,
            hostedEvents: 0,
            auraPoints: 10,
          };
          await setDoc(userDocRef, defaultData);
          setUserData(defaultData);
          setFormData({
            name: "",
            nickname: "",
            bio: "",
          });
        }

        // Realtime updates
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
        alert("Error loading profile data. Please try again.");
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
    if (!auth.currentUser) {
      alert("Please log in to update your profile.");
      return;
    }

    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        name: formData.name,
        nickname: formData.nickname,
        bio: formData.bio,
      });

      setEditMode(false);
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold">Profile</h3>
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
              className="border rounded p-2"
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
