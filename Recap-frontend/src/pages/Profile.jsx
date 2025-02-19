import React, { useState } from 'react';
import { Camera, Upload, X, BookOpen, Bell, Shield, Briefcase, GraduationCap, Link, Github, Linkedin, Twitter } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Notification from '@/components/Notifications';
import NavBar from '@/components/NavBar';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    institution: '',
    major: '',
    yearOfStudy: '',
    studyPreferences: '',
    github: '',
    linkedin: '',
    twitter: '',
    experience: [{ organization: '', role: '', duration: '' }]
  });

  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(e.dataTransfer.files[0]);
    }
  };

  const handleExperienceChange = (index, field, value) => {
    const newExperience = [...formData.experience];
    newExperience[index][field] = value;
    setFormData({ ...formData, experience: newExperience });
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <NavBar icon={<Shield className="w-6 h-6 text-purple-400" />} header={"Student Profile"} button3={"Study Stats"} />

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-8 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div 
                  className={`relative w-40 h-40 rounded-full overflow-hidden ${
                    dragActive ? 'ring-4 ring-purple-500' : 'ring-2 ring-purple-400/30'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {preview ? (
                    <>
                      <img src={preview} alt="Profile" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setPreview(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500/90 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="w-full h-full bg-gray-800/80 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-700/80 transition-colors">
                      <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      <Camera className="w-8 h-8 text-purple-400 mb-2" />
                      <span className="text-sm text-purple-400">Upload Photo</span>
                    </label>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="bg-gray-800/80 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="bg-gray-800/80 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                    />
                  </div>
                  <textarea
                    name="bio"
                    placeholder="Tell us about your study goals and interests..."
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-gray-800/80 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="bg-gray-800/90 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-6">
                <GraduationCap className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Academic Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-300 mb-2">Institution</label>
                  <input
                    type="text"
                    name="institution"
                    placeholder="Your University/College"
                    value={formData.institution}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Major/Field of Study</label>
                  <input
                    type="text"
                    name="major"
                    placeholder="e.g. Computer Science"
                    value={formData.major}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">First Year</option>
                    <option value="2">Second Year</option>
                    <option value="3">Third Year</option>
                    <option value="4">Fourth Year</option>
                    <option value="5">Graduate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Study Preferences</label>
                  <input
                    type="text"
                    name="studyPreferences"
                    placeholder="e.g. Visual learning, Group study"
                    value={formData.studyPreferences}
                    onChange={handleChange}
                    className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-800/90 rounded-xl p-6 shadow-lg backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-6">
                <Link className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Social Links</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="github"
                    placeholder="GitHub Username"
                    value={formData.github}
                    onChange={handleChange}
                    className="w-full pl-10 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="linkedin"
                    placeholder="LinkedIn Username"
                    value={formData.linkedin}
                    onChange={handleChange}
                    className="w-full pl-10 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="twitter"
                    placeholder="Twitter Username"
                    value={formData.twitter}
                    onChange={handleChange}
                    className="w-full pl-10 bg-gray-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg">
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;