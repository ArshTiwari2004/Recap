import React, { useEffect, useState } from "react";
import { auth, database } from "../config/Firebaseconfig";
import { ref, set, onValue, onDisconnect } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";

const ActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const userId = user.uid;
      const userRef = ref(database, `activeUsers/${userId}`);

      // Set user online
      set(userRef, { status: "online", email: user.email });

      // Set user offline when they disconnect
      onDisconnect(userRef).set({ status: "offline" });

      // Listen for active users in real-time
      const activeUsersRef = ref(database, "activeUsers");
      onValue(activeUsersRef, (snapshot) => {
        const usersData = snapshot.val();
        if (usersData) {
          const usersList = Object.entries(usersData)
            .filter(([_, value]) => value.status === "online")
            .map(([key, value]) => ({ id: key, email: value.email }));

          setActiveUsers(usersList);
        } else {
          setActiveUsers([]);
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Active Users</h2>
      <p>Total active users: {activeUsers.length}</p>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveUsers;
