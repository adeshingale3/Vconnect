import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const TopThreeCard = ({ user }) => {
  const backgrounds = {
    1: 'bg-gradient-to-br from-yellow-100 to-yellow-50 border-yellow-200',
    2: 'bg-gradient-to-br from-gray-100 to-gray-50 border-gray-200',
    3: 'bg-gradient-to-br from-orange-100 to-orange-50 border-orange-200',
  };

  const textColors = {
    1: 'text-yellow-600',
    2: 'text-gray-600',
    3: 'text-orange-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${backgrounds[user.rank]} p-6 rounded-xl border shadow-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold ${textColors[user.rank]}`}>
            {user.rank === 1 && '🏆'}
            {user.rank === 2 && '🥈'}
            {user.rank === 3 && '🥉'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className={`${textColors[user.rank]} font-semibold`}>
              {user.auraPoints.toFixed(1)} Points
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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

        const sortedUsers = users.sort((a, b) => b.auraPoints - a.auraPoints);
        const rankedUsers = sortedUsers.map((user, index) => ({
          rank: index + 1,
          ...user,
        }));

        setLeaderboardData(rankedUsers);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, []);

  const topThree = leaderboardData.slice(0, 3);
  const restOfUsers = leaderboardData.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900">Volunteer Leaderboard</h2>
          <p className="mt-2 text-gray-600">Top volunteers making a difference</p>
        </motion.div>

        {/* Top 3 Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {topThree.map((user) => (
            <TopThreeCard key={user.id} user={user} />
          ))}
        </div>

        {/* Rest of the Leaderboard */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {restOfUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-6 ${
                index !== restOfUsers.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold bg-blue-50 text-blue-600">
                  {user.rank}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                </div>
              </div>
              <div className="bg-blue-50 rounded-full px-4 py-1">
                <span className="text-blue-600 font-semibold">
                  {user.auraPoints.toFixed(1)} Points
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;