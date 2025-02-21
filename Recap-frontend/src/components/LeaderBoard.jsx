import React, { useState } from "react";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

const leaderboardData = [
  {
    id: 1,
    name: "Rajat Mehra",
    location: "Maharashtra",
    score: 9500,
    badges: ["CityExplorer", "FoodExplorer", "GoldMedalist"],
    profilePic: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Shantipriya",
    location: "Tamil Nadu",
    score: 9200,
    badges: ["CulturalAmbassador", "HeritageHunter", "SilverMedalist"],
    profilePic: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Arsh Tiwari",
    location: "Uttar Pradesh",
    score: 8900,
    badges: ["PhotoPro", "ArtAdmirer", "BronzeMedalist"],
    profilePic: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Tanya",
    location: "Delhi",
    score: 8700,
    badges: ["CityExplorer", "FoodExplorer"],
    profilePic: "https://i.pravatar.cc/150?img=4",
  },
];

const LeaderBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <NavBar
          icon={<Trophy className="w-6 h-6 text-yellow-400" />}
          header="Leaderboard"
          button1={"FeedBack"}
          button2={"Help"}
          button3={"Docs"}
        />

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl pl-4 font-extrabold text-white">LeaderBoard</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold shadow-md hover:bg-yellow-500"
            >
              How Scoring Works?
            </button>
          </div>

          <div className="bg-gray-800 shadow-lg rounded-2xl p-4">
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border-b border-gray-700 last:border-b-0"
                >
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-bold text-yellow-400">#{index + 1}</p>
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold text-white">{user.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-md font-semibold text-white">Score: {user.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold text-white mb-4">How Scoring Works?</h2>
            <div className="text-gray-300 space-y-2 text-sm">
              <p><strong>Daily Engagement:</strong></p>
              <p>• Daily Visit – 10 points</p>
              <p>• Consistent 7-day Streak – 30 bonus points</p>
              <p>• Consistent 30-day Streak – 150 bonus points</p>

              <p><strong>Learning Activities:</strong></p>
              <p>• Quiz Completed:</p>
              <p>  - Easy – 10 points</p>
              <p>  - Medium – 15 points</p>
              <p>  - Hard – 20 points</p>
              <p>• Flashcard Generation – 5 points</p>
              <p>• Correct Quiz Answer – 3 points per correct answer</p>

              <p><strong>Content Contribution:</strong></p>
              <p>• Notes Upload – 5 points</p>
              <p>• PDF Upload (Resource Sharing) – 15 points</p>

              <p><strong>Group Activities:</strong></p>
              <p>• Creating a Study Group – 20 points</p>
              <p>• Joining a Study Group – 10 points</p>

              <p><strong>Gamification Add-ons:</strong></p>
              <p>• Leaderboard Bonus: Weekly top 3 users get 100 extra points</p>
              <p>• Referral System: Inviting a friend who registers and completes a quiz – 50 points</p>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderBoard;
