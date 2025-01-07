import React from 'react';
import { X } from 'lucide-react';
import { ButtonsCard } from '../components/ui/tailwindcss-buttons';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/50 w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
        <form className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end">
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300">Forgot Password?</a>
          </div>
          <ButtonsCard className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3">Log In</ButtonsCard>
          <button className="w-full border border-gray-700 hover:border-gray-600 text-white py-3 flex items-center justify-center gap-2">
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          <p className="text-center text-gray-400 text-sm">
            Don't have an account? <a href="#" className="text-purple-400 hover:text-purple-300">Signup Now</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
