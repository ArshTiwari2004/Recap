import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, fireDB } from '../config/Firebaseconfig';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';

const FirebaseContext = createContext();

export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        fetchUserGroups(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserGroups = async (userId) => {
    const groupsRef = collection(fireDB, 'groups');
    const q = query(
      groupsRef,
      where('members', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = [];
      snapshot.forEach((doc) => {
        groups.push({ id: doc.id, ...doc.data() });
      });
      setUserGroups(groups);
    });

    return unsubscribe;
  };

  const createGroup = async (groupData) => {
    try {
      const groupRef = await addDoc(collection(fireDB, 'groups'), {
        ...groupData,
        createdBy: currentUser.uid,
        members: [currentUser.uid],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return groupRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const joinGroup = async (groupId) => {
    try {
      const groupRef = doc(fireDB, 'groups', groupId);
      await updateDoc(groupRef, {
        members: [...userGroups.find(g => g.id === groupId).members, currentUser.uid]
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  const addMessage = async (groupId, message) => {
    try {
      await addDoc(collection(fireDB, `groups/${groupId}/messages`), {
        text: message,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const addNote = async (groupId, note) => {
    try {
      await addDoc(collection(fireDB, `groups/${groupId}/notes`), {
        ...note,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userGroups,
    loading,
    createGroup,
    joinGroup,
    addMessage,
    addNote
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};