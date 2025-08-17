import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { addTimeSpent, getTodayTime, getWeekTime } from "../services/TimeSpentService";
import { getAuth } from "firebase/auth";

const TimeSpent = () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [todayMinutes, setTodayMinutes] = useState(0);
  const [weekMinutes, setWeekMinutes] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    let interval;
    let sessionStart = Date.now();

    const updateTime = async () => {
      const now = Date.now();
      const diffMinutes = Math.floor((now - sessionStart) / 60000); // milliseconds → minutes
      if (diffMinutes > 0) {
        await addTimeSpent(currentUser.uid, diffMinutes);
        sessionStart = now;
        const today = await getTodayTime(currentUser.uid);
        const week = await getWeekTime(currentUser.uid);
        setTodayMinutes(today);
        setWeekMinutes(week);
      }
    };

    // Update every 1 min
    interval = setInterval(updateTime, 60000);

    // Update on unload
    const handleUnload = async () => {
      await updateTime();
    };
    window.addEventListener("beforeunload", handleUnload);

    // Initial fetch
    (async () => {
      const today = await getTodayTime(currentUser.uid);
      const week = await getWeekTime(currentUser.uid);
      setTodayMinutes(today);
      setWeekMinutes(week);
    })();

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [currentUser]);

  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  return (
  <div className="p-3 bg-gray-800 rounded-lg flex items-center space-x-4">
    <div className="p-3 bg-purple-500/20 rounded-lg">
      <Clock className="w-6 h-6 text-purple-400" />
    </div>
    <div>
      <p className="text-sm text-gray-400">Focused Hours</p>
      <p className="text-xl font-semibold text-white">
        {formatTime(todayMinutes)}
      </p>
    <p className="text-xs text-green-400">
  +{formatTime(weekMinutes)} this week, keep it up!
</p>

    </div>
  </div>
);

};

export default TimeSpent;
