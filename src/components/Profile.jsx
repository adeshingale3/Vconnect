import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import updateDoc and other Firestore methods

const Profile = () => {
  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    bio: "",
    participatedEvents: 0,
    hostedEvents: 0,
    auraPoints: 0,
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    bio: "",
  });

  useEffect(() => {
    // Fetch user data from Firestore when the component mounts
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
          setFormData(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    if (auth.currentUser) {
      fetchUserData();
    }
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userDocRef, {
        name: formData.name,
        nickname: formData.nickname,
        bio: formData.bio,
      });

      setUserData(formData);
      setEditMode(false);
      console.log("User data updated successfully");
    } catch (error) {
      console.error("Error updating user data: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Profile</h2>
        
        <div className="mb-4">
          <span className="text-lg font-semibold">Name: </span>
          {editMode ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
            />
          ) : (
            <span>{userData.name}</span>
          )}
        </div>

        <div className="mb-4">
          <span className="text-lg font-semibold">Nickname: </span>
          {editMode ? (
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
            />
          ) : (
            <span>{userData.nickname}</span>
          )}
        </div>

        <div className="mb-4">
          <span className="text-lg font-semibold">Bio: </span>
          {editMode ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2"
            />
          ) : (
            <span>{userData.bio}</span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card text-center p-4 bg-blue-100 rounded">
            <h3>Participated Events</h3>
            <p>{userData.participatedEvents}</p>
          </div>
          <div className="card text-center p-4 bg-green-100 rounded">
            <h3>Hosted Events</h3>
            <p>{userData.hostedEvents}</p>
          </div>
          <div className="card text-center p-4 bg-yellow-100 rounded">
            <h3>Aura Points</h3>
            <p>{userData.auraPoints}</p>
          </div>
        </div>

        <button
          onClick={handleEditToggle}
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>

        {editMode && (
          <button
            onClick={handleSave}
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg mt-4 hover:bg-green-600 transition duration-200"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
