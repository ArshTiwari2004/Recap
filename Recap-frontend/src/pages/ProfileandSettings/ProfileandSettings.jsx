// components/ProfileAndSettings.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'lucide-react';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { fireDB, storage } from '../../config/Firebaseconfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import toast from 'react-hot-toast';
import GlobalLogoutModal from '@/global/GlobalLogoutModal';

const ProfileAndSettings = ({ activeTab = 'profile' }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const inputFileRef = useRef(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    class: "",
    board: "",
    parentEmail: ""
  });

  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Settings state
  const [notifications, setNotifications] = useState({
    studyReminders: true,
    noteUpdates: true,
    groupInvites: true,
    dailyDigest: false
  });

useEffect(() => {
  const fetchProfileData = async () => {
    if (currentUser) {
      // 1️⃣ Get Auth info
      const nameParts = (currentUser.displayName || "").split(" ");
      const initialProfile = {
        firstName: nameParts[0] || "",
        lastName: nameParts.slice(1).join(" ") || "",
        email: currentUser.email || "",
        phone: "",
        address: "",
        class: "",
        board: "",
        parentEmail: ""
      };

      // 2️⃣ Fetch Firestore data
      const docRef = doc(fireDB, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        setProfileData({
          ...initialProfile,
          phone: firestoreData.phone || "",
          address: firestoreData.address || "",
          class: firestoreData.class || "",
          board: firestoreData.board || "",
          parentEmail: firestoreData.parentEmail || ""
        });
      } else {
        // If no Firestore data exists, use initial defaults
        setProfileData(initialProfile);
      }

      // 3️⃣ Set profile picture
      setPreview(currentUser.photoURL);
    }
  };

  fetchProfileData();
}, [currentUser]);


  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    const storageRef = ref(storage, `users/${currentUser.uid}/profile.jpg`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      null,
      () => toast.error("Upload failed"),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateProfile(currentUser, { photoURL: downloadURL });
        toast.success("Profile picture updated");
      }
    );
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(currentUser, { 
        displayName: `${profileData.firstName} ${profileData.lastName}` 
      });
      
      if (currentUser.email !== profileData.email) {
        await updateEmail(currentUser, profileData.email);
      }

      await setDoc(
        doc(fireDB, "users", currentUser.uid),
        { ...profileData, photoURL: currentUser.photoURL },
        { merge: true }
      );

      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };

  const handleToggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 h-screen fixed left-0 top-0 p-6 border-r border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-8">Profile & Settings</h1>
        
        <div className="space-y-1">
          <div 
            onClick={() => setCurrentTab('profile')}
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${currentTab === 'profile' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <span className="font-medium">My Profile</span>
          </div>
          
          <div 
            onClick={() => setCurrentTab('settings')}
            className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${currentTab === 'settings' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <span className="font-medium">Settings</span>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {currentTab === 'profile' ? (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">My Profile</h2>
            
            {/* Profile Section */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-6 mb-6">
                <div 
                  className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer"
                  onClick={() => inputFileRef.current.click()}
                >
                  <img
                    src={preview || "/default-profile.png"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input
                    ref={inputFileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])}
                  />
                </div>
                
            <div className="flex gap-6">
  {/* First Name */}
  <div className="flex flex-col flex-1">
    <label className="text-sm text-gray-400 mb-1" htmlFor="firstName">
      First Name
    </label>
    <input
      id="firstName"
      name="firstName"
      value={profileData.firstName}
      onChange={handleProfileChange}
      placeholder="First Name"
      className="text-xl font-bold bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
    />
  </div>

  {/* Last Name */}
  <div className="flex flex-col flex-1">
    <label className="text-sm text-gray-400 mb-1" htmlFor="lastName">
      Last Name
    </label>
    <input
      id="lastName"
      name="lastName"
      value={profileData.lastName}
      onChange={handleProfileChange}
      placeholder="Last Name"
      className="text-xl font-bold bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
    />
  </div>
</div>


              </div>
              
           <div className="space-y-4">
  <div className="flex items-center gap-4">
    {/* Label */}
    <div className="w-32 flex flex-col">
      <label className="text-sm text-gray-400 mb-1" htmlFor="email">
        Email
      </label>
    </div>

    {/* Input */}
    <input
      id="email"
      name="email"
      value={profileData.email}
      onChange={handleProfileChange}
      className="flex-1 text-lg bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
      placeholder="Enter your Email"
    />
  </div>
</div>

            </div>
            
            {/* Contact Info Section */}
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Phone Number</h3>
              <div className="flex items-center">
                <span className="w-32 text-gray-400">Phone</span>
                <input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="flex-1 bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
                />
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">Address</h3>
                <input
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="w-full bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
                />
              </div>
            </div>
            
            {/* Academic Info Section */}
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="w-32 text-gray-400">Class</span>
                  <input
                    name="class"
                    value={profileData.class}
                    onChange={handleProfileChange}
                    className="flex-1 bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
                  />
                </div>
                
                <div className="flex items-center">
                  <span className="w-32 text-gray-400">Board</span>
                  <input
                    name="board"
                    value={profileData.board}
                    onChange={handleProfileChange}
                    className="flex-1 bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
                  />
                </div>
                
                <div className="flex items-center mt-6">
                  <span className="w-32 text-gray-400">Parent's Email</span>
                  <input
                    name="parentEmail"
                    value={profileData.parentEmail}
                    onChange={handleProfileChange}
                    placeholder="Add Email"
                    className="flex-1 bg-transparent border-b border-gray-700 focus:outline-none focus:border-purple-500 pb-1"
                  />
                </div>
              </div>
            </div>
            
            <button
              onClick={handleSaveProfile}
              className="mt-8 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium float-right"
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Settings</h2>
            
            <div className="bg-gray-900 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Study Reminders</p>
                    <p className="text-sm text-gray-400">Get reminders for your study sessions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.studyReminders}
                      onChange={() => handleToggleNotification('studyReminders')}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Note Updates</p>
                    <p className="text-sm text-gray-400">Notifications when your notes are updated</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.noteUpdates}
                      onChange={() => handleToggleNotification('noteUpdates')}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Group Invites</p>
                    <p className="text-sm text-gray-400">Notifications for study group invitations</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.groupInvites}
                      onChange={() => handleToggleNotification('groupInvites')}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Daily Digest</p>
                    <p className="text-sm text-gray-400">Summary of your daily study progress</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={notifications.dailyDigest}
                      onChange={() => handleToggleNotification('dailyDigest')}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Account</h3>
              <button 
                onClick={() => setIsLogoutModalOpen(true)}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>

       <GlobalLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default ProfileAndSettings;