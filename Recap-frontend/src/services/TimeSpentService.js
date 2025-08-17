// src/services/TimeSpentService.js
import { collection, doc, getDoc, setDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { fireDB } from "../config/Firebaseconfig";

export const addTimeSpent = async (userId, minutes) => {
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const docRef = doc(fireDB, "timeSpent", `${userId}_${today}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        await updateDoc(docRef, { timeSpent: docSnap.data().timeSpent + minutes });
    } else {
        await setDoc(docRef, { userId, date: today, timeSpent: minutes });
    }
};

export const getTodayTime = async (userId) => {
    const today = new Date().toISOString().split("T")[0];
    const docRef = doc(fireDB, "timeSpent", `${userId}_${today}`);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data().timeSpent : 0;
};

export const getWeekTime = async (userId) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    const monday = new Date(today);
    monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7)); // Monday of this week
    const mondayStr = monday.toISOString().split("T")[0];

    const timeSpentRef = collection(fireDB, "timeSpent");
    const q = query(timeSpentRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    let weekTotal = 0;
    querySnapshot.forEach((doc) => {
        if (doc.data().date >= mondayStr) {
            weekTotal += doc.data().timeSpent;
        }
    });

    return weekTotal;
};

export const getWeekTimeData = async (userId) => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sun) - 6 (Sat)
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Monday of this week

    const timeSpentRef = collection(fireDB, "timeSpent");
    const q = query(timeSpentRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Initialize an array with all days of the week
    const weekData = Array(7).fill().map((_, i) => ({
        dayOfWeek: i,
        minutes: 0
    }));

    querySnapshot.forEach((doc) => {
        const docDate = new Date(doc.data().date);
        if (docDate >= monday) {
            const docDay = docDate.getDay();
            weekData[docDay].minutes = doc.data().timeSpent;
        }
    });

    return weekData;
};
