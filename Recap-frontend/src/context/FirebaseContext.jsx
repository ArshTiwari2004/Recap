import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  query, 
  where,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { fireDB, storage, auth } from '../config/Firebaseconfig';
import { v4 as uuidv4 } from 'uuid';

const FirebaseContext = createContext();

export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
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

  // Fetch and listen to user's groups
  const fetchUserGroups = (userId) => {
    const q = query(
      collection(fireDB, 'groups'),
      where('members', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUserGroups(groups);
    });

    return unsubscribe;
  };

  // Create a new group
  const createGroup = async (groupData) => {
    try {
      const inviteCode = uuidv4().substring(0, 8);
      const docRef = await addDoc(collection(fireDB, 'groups'), {
        ...groupData,
        createdBy: currentUser.uid,
        members: [currentUser.uid],
        inviteCode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      return { success: true, groupId: docRef.id, inviteCode };
    } catch (error) {
      console.error('Error creating group:', error);
      return { success: false, error };
    }
  };

  // Join group using invite code
  const joinGroupByCode = async (inviteCode) => {
    try {
      const q = query(
        collection(fireDB, 'groups'),
        where('inviteCode', '==', inviteCode)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Invalid invite code');
      }

      const groupDoc = querySnapshot.docs[0];
      await updateDoc(doc(fireDB, 'groups', groupDoc.id), {
        members: arrayUnion(currentUser.uid)
      });

      return { success: true, groupId: groupDoc.id };
    } catch (error) {
      console.error('Error joining group:', error);
      return { success: false, error };
    }
  };

  // Join group by ID (for direct joins)
  const joinGroup = async (groupId) => {
    try {
      const groupRef = doc(fireDB, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(currentUser.uid)
      });
      return { success: true };
    } catch (error) {
      console.error('Error joining group:', error);
      return { success: false, error };
    }
  };

  // Leave group
  const leaveGroup = async (groupId) => {
    try {
      await updateDoc(doc(fireDB, 'groups', groupId), {
        members: arrayRemove(currentUser.uid)
      });
      return { success: true };
    } catch (error) {
      console.error('Error leaving group:', error);
      return { success: false, error };
    }
  };

  // Delete group
  const deleteGroup = async (groupId) => {
    try {
      const groupRef = doc(fireDB, 'groups', groupId);
      const groupSnap = await getDocs(groupRef);
      
      if (groupSnap.data().createdBy !== currentUser.uid) {
        throw new Error('Only group creator can delete the group');
      }
      
      await deleteDoc(groupRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting group:', error);
      return { success: false, error };
    }
  };

  // Upload file
  const uploadFile = async (groupId, file) => {
    try {
      const fileRef = ref(storage, `groups/${groupId}/${file.name}_${Date.now()}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      
      await addDoc(collection(fireDB, `groups/${groupId}/files`), {
        name: file.name,
        url: downloadURL,
        type: file.type,
        uploadedBy: currentUser.uid,
        uploadedAt: serverTimestamp()
      });

      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { success: false, error };
    }
  };

  // Add message to group chat
  const addMessage = async (groupId, message) => {
    try {
      await addDoc(collection(fireDB, `groups/${groupId}/messages`), {
        text: message,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error sending message:', error);
      return { success: false, error };
    }
  };

  // Add note to group
  const addNote = async (groupId, note) => {
    try {
      await addDoc(collection(fireDB, `groups/${groupId}/notes`), {
        ...note,
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        createdAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      console.error('Error adding note:', error);
      return { success: false, error };
    }
  };

  const value = {
    currentUser,
    userGroups,
    loading,
    createGroup,
    joinGroup,
    joinGroupByCode,
    leaveGroup,
    deleteGroup,
    uploadFile,
    addMessage,
    addNote
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);

export default FirebaseContext;