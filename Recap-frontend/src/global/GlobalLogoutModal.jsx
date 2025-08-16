"use client";

import React from "react";
import { LogOut, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/config/Firebaseconfig";
import toast from "react-hot-toast";

const GlobalLogoutModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("You have been logged out!");
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error.message);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl w-96 p-6 relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-4 rounded-full">
            <LogOut className="w-6 h-6 text-red-500" />
          </div>
        </div>

        {/* Message */}
        <h2 className="text-center font-semibold text-lg mb-6 text-gray-800 ">
          Are you sure you want to log out?
        </h2>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Log Out
          </button>
          <button
            onClick={onClose}
            className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalLogoutModal;
