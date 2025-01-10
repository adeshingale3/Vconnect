import { useState, useEffect } from 'react';
import { db } from '../firebase'; // Adjust the import based on your setup
import { collection, getDocs } from 'firebase/firestore';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const users = [];

        usersSnapshot.forEach(doc => {
          const userData = doc.data();
          users.push({
            id: doc.id,
            name: userData.name || 'Unnamed User',
            auraPoints: userData.auraPoints || 0,
          });
        });

        // Sort users by aura points in descending order
        const sortedUsers = users.sort((a, b) => b.auraPoints - a.auraPoints);

        // Add rank to the sorted data
        const rankedUsers = sortedUsers.map((user, index) => ({
          rank: index + 1,
          name: user.name,
          auraPoints: user.auraPoints,
        }));

        setLeaderboardData(rankedUsers);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4 mt-16">Leaderboard</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Rank</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Aura Points</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((user) => (
            <tr key={user.rank}>
              <td className="border px-4 py-2">{user.rank}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.auraPoints}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
