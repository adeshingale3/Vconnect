import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Profile = () => {
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
            <span>{userData.name}</span>
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
            <span>{userData.nickname}</span>
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
            <span>{userData.bio}</span>
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
