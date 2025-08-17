import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { fireDB } from '../config/Firebaseconfig';

export const updateNoteStats = async (userId) => {
    if (!userId) return;

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const statsRef = doc(fireDB, 'notesStats', userId);
        const statsSnap = await getDoc(statsRef);

        if (statsSnap.exists()) {
            const statsData = statsSnap.data();
            const lastUpdated = statsData.lastUpdated?.toDate();

            // Check if last update was today
            const isSameDay = lastUpdated && lastUpdated >= today;

            await updateDoc(statsRef, {
                totalNotesUploaded: (statsData.totalNotesUploaded || 0) + 1,
                notesUploadedToday: isSameDay ? (statsData.notesUploadedToday || 0) + 1 : 1,
                lastUpdated: serverTimestamp()
            });
        } else {
            // Create new stats document
            await setDoc(statsRef, {
                totalNotesUploaded: 1,
                notesUploadedToday: 1,
                lastUpdated: serverTimestamp()
            });
        }
    } catch (error) {
        console.error("Error updating note stats:", error);
    }
};