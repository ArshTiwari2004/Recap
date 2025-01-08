import React from 'react';
import { X } from 'lucide-react';
import { ButtonsCard } from '../components/ui/tailwindcss-buttons';
import { signInWithEmailAndPassword, signInWithPopup,GithubAuthProvider, GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from '../config/Firebaseconfig.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { HiEye, HiEyeOff } from "react-icons/hi";

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const loginUsingEmailAndPassword = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user)); // Store user data in local storage
      toast.success("Login Successful!");
      navigate('/upload-note');
      onClose();
    } catch (error) {
      console.error("Error during email/password login:", error);
      toast.error(error.message || "Login failed!");
    }
  };

  const handleGitHubLogin = async () => {
    try {
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      console.log("User Info:", user);
      toast.success(`Welcome ${user.displayName || user.email}`);
      navigate('/upload-note');
      onClose();
    } catch (error) {
      console.error("Error during GitHub login:", error);
      toast.error(error.message || "GitHub login failed!");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Store user information in local storage or handle it as needed
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.displayName || user.email}!`);
      navigate('/upload-note');
      console.log("User Info:", user);
    } catch (error) {
      console.error("Error during Google Sign-In:", error.code, error.message);
      toast.error(error.message || "Google Sign-In failed!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div className="bg-gray-900 rounded-2xl border border-purple-500/50 w-full max-w-md p-8 relative">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>
      <form className="space-y-4" onSubmit={loginUsingEmailAndPassword}>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
       <div className="relative">
      <label className="text-sm font-medium text-gray-300 block mb-2">
        Password
      </label>
      <input
        type={showPassword ? "text" : "password"} // Toggle between text and password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
      />
      {/* Button to toggle password visibility */}
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
      >
        {showPassword ? (
          <HiEyeOff size={22} className='mt-7'/>
        ) : (
          <HiEye size={22} className='mt-7' />
        )}
      </button>
    </div>
        <div className="flex justify-end">
          <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
        >
          Log In
        </button>
        <button
          type="button"
          onClick={handleGitHubLogin}
          className="w-full border border-gray-700 hover:border-gray-600 text-white py-3 flex items-center justify-center gap-2 rounded-lg"
        >
          <img src="/github.svg" alt="Github" className="w-5 h-5" />
          Sign in with Github
        </button>
        <button
          onClick={handleGoogleSignIn}
          className="w-full border border-gray-700 hover:border-gray-600 text-white py-3 flex items-center justify-center gap-2 mt-4"
        >
          <img src="/google.svg" alt="GitHub" className="w-5 h-5" />
          Sign in with Google
        </button>
        {/* <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            Signup Now
          </a>
        </p> */}
      </form>
    </div>
  </div>
  );
};

export default LoginModal;
