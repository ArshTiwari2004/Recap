import React, { useState, useEffect } from "react";
import { Trophy, Medal, Crown, Star, Flame } from "lucide-react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { fireDB } from "@/config/Firebaseconfig";
import Sidebar from "./Sidebar";
import NavBar from "./NavBar";
import Chatbot from "@/pages/ChatBot";
import { useUser } from "@/context/UserContext";

const LeaderBoard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const q = query(
      collection(fireDB, "users"),
      orderBy("streak", "desc"),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        streak: doc.data().streak || 0,
      }));
      setLeaderboardData(userData);
    });

    return () => unsubscribe();
  }, []);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankStyle = (index) => {
    switch (index) {
      case 0:
        return {
          border: "border-2 border-yellow-400",
          icon: <Crown className="w-6 h-6 text-yellow-400" />,
          badge: "bg-yellow-400/20 text-yellow-400",
          ring: "ring-4 ring-yellow-400/30"
        };
      case 1:
        return {
          border: "border-2 border-gray-300",
          icon: <Medal className="w-6 h-6 text-gray-300" />,
          badge: "bg-gray-300/20 text-gray-300",
          ring: "ring-4 ring-gray-300/30"
        };
      case 2:
        return {
          border: "border-2 border-amber-600",
          icon: <Medal className="w-6 h-6 text-amber-600" />,
          badge: "bg-amber-600/20 text-amber-600",
          ring: "ring-4 ring-amber-600/30"
        };
      default:
        return {
          border: "border border-gray-700",
          icon: null,
          badge: "bg-purple-500/20 text-purple-400",
          ring: ""
        };
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <NavBar
          icon={<Trophy className="w-6 h-6 text-yellow-400" />}
          header="Leaderboard"
          button1="Feedback"
          button2="Help"
          button3="Docs"
        />

        <div className="p-6 flex flex-col h-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl pl-4 font-extrabold text-white">
                Daily Streaks Leaderboard
              </h1>
              <p className="text-gray-400 pl-4 mt-2">Top 10 learners competing for the longest streaks</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-yellow-500 transition-all duration-300 flex items-center space-x-2"
            >
              <Flame className="w-5 h-5" />
              <span>How Streaks Work?</span>
            </button>
          </div>

          <div className="bg-gray-800 shadow-xl rounded-2xl p-6 border border-gray-700 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            <div className="space-y-4">
              {leaderboardData.map((userData, index) => {
                const rankStyle = getRankStyle(index);
                return (
                  <div
                    key={userData.id}
                    className={`flex items-center justify-between p-6 rounded-xl transition-all duration-300 hover:scale-[1.01] ${
                      userData.id === user?.uid
                        ? "bg-purple-500/20 border-2 border-purple-500"
                        : `bg-gray-700/50 hover:bg-gray-700 ${rankStyle.border}`
                    }`}
                  >
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 flex justify-center">
                          {rankStyle.icon || (
                            <span className="text-lg font-bold text-gray-400">
                              #{index + 1}
                            </span>
                          )}
                        </div>
                        <div className={`w-14 h-14 rounded-full bg-gray-600 flex items-center justify-center ${rankStyle.ring}`}>
                          <span className="text-xl font-bold text-white">
                            {getInitials(userData.displayName)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {userData.displayName || "Anonymous User"}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-sm text-gray-400">
                            {userData.email || "No email"}
                          </p>
                          {index < 3 && (
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className={`${rankStyle.badge} px-6 py-3 rounded-lg flex items-center space-x-2`}>
                        <Flame className="w-5 h-5" />
                        <p className="font-semibold">
                          {userData.streak} day streak
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-xl max-w-lg w-full border-2 border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-3">
              <Flame className="w-6 h-6 text-yellow-400" />
              <span>How Streaks Work?</span>
            </h2>
            <div className="text-gray-300 space-y-4">
              <p className="font-semibold text-lg text-white">Daily Streaks System:</p>
              <ul className="space-y-3">
                {[
                  "Log in daily to maintain your streak",
                  "Complete at least one quiz per day to increase your streak",
                  "Missing a day resets your streak to 0",
                  "Longer streaks earn you special badges and higher leaderboard positions",
                  "Compete with other users to maintain the longest active streak"
                ].map((item, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 w-full font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Chatbot />
    </div>
  );
};

export default LeaderBoard;