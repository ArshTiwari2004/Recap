import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { BookOpen } from "lucide-react";
import NavBar from "./NavBar";

const UserLeaderBoard = () => {
  const [leaders, setLeaders] = useState([]);
  const [user, setUser] = useState(null);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  useEffect(() => {
    // Dummy Data for testing
    const dummyData = [
      { id: "1", name: "Alice Johnson", score: 95 },
      { id: "2", name: "Bob Smith", score: 90 },
      { id: "3", name: "Charlie Brown", score: 85 },
      { id: "4", name: "David Lee", score: 80 },
      { id: "5", name: "Eva Davis", score: 75 },
    ];

    setLeaders(dummyData);

    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavBar header={"Leaderboard"} button2={"FeedBack"} button3={"Docs"} />

        {/* Leaderboard Table */}
        <div className="p-6">
          <h1 className="text-5xl text-center font-bold mb-4 text-white">Leaderboard</h1>
          <table className="w-full border-collapse border border-gray-700 text-white">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 p-2">Rank</th>
                <th className="border border-gray-700 p-2">Name</th>
                <th className="border border-gray-700 p-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader, index) => (
                <tr key={leader.id} className="text-center bg-gray-700">
                  <td className="border border-gray-600 p-2">{index + 1}</td>
                  <td className="border border-gray-600 p-2">{leader.name}</td>
                  <td className="border border-gray-600 p-2">{leader.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserLeaderBoard;
