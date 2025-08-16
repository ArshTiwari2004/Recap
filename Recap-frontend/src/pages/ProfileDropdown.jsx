import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, User, Lock, CircleHelp } from "lucide-react";
import GlobalLogoutModal from "../global/GlobalLogoutModal";

const ProfileDropdown = ({ email }) => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  return (
    <div className="absolute right-4 top-16 w-72 bg-gray-800 rounded-xl shadow-xl border border-gray-700 z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-white font-semibold text-base">Account</h3>
        <p className="text-gray-400 text-sm truncate">{email}</p>
      </div>

      {/* Links */}
      <div className="p-2 space-y-1">
        <Link
          to="/profile-settings"
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
        >
          <User className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Profile & Settings</span>
        </Link>

        <Link
          to="/help"
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
        >
          <Lock className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Privacy & Terms</span>
        </Link>

        <Link
          to="/help"
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
        >
          <CircleHelp className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">FAQs</span>
        </Link>

        <div
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-3 hover:bg-gray-700 rounded-lg px-3 py-2 cursor-pointer transition-colors"
        >
          <LogOut className="w-5 h-5 text-purple-400" />
          <span className="text-white text-sm">Logout</span>
        </div>
      </div>

      {/* Upgrade Button */}
      <div className="border-t border-gray-700 p-4">
        <Link to="/premium">
          <button className="w-full py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all">
            Upgrade to Premium
          </button>
        </Link>
      </div>

      {/* Logout Modal */}
      <GlobalLogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      />
    </div>
  );
};

export default ProfileDropdown;
