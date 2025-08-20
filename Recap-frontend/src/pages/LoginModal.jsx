import React from 'react';
import { X , Eye , EyeOff} from 'lucide-react';
import { ButtonsCard } from '../components/ui/tailwindcss-buttons';
import { signInWithEmailAndPassword, signInWithPopup, GithubAuthProvider, GoogleAuthProvider, signInWithRedirect, sendPasswordResetEmail } from "firebase/auth";
import { auth, fireDB } from '../config/Firebaseconfig.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { HiEye, HiEyeOff } from "react-icons/hi";
import SignupModal from './SignupModal';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';

const LoginModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [signupOpen, setSignupOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const trackUserLogin = async (user) => {
    if (!user) return;
  
    const userRef = doc(fireDB, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const now = Timestamp.now();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  
    if (!userSnap.exists()) {
      // New user, create record
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email || "",
        provider: user.providerData[0]?.providerId.replace(".com", "") || "email",
        createdAt: now,
        lastLogin: now,
        loginCount: 1,
        dailyPoints: 10,
        streak: 1
      });
      return;
    }
  
    const userData = userSnap.data();
    const lastLoginDate = userData.lastLogin.toDate().toISOString().split("T")[0];
  
    if (lastLoginDate !== today) {
      // User logs in on a new day
      let newStreak = userData.streak;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayFormatted = yesterday.toISOString().split("T")[0];
  
      if (lastLoginDate === yesterdayFormatted) {
        newStreak += 1; // Continue streak
      } else {
        newStreak = 1; // Reset streak
      }
  
      await updateDoc(userRef, {
        loginCount: (userData.loginCount || 0) + 1,
        lastLogin: now,
        dailyPoints: (userData.dailyPoints || 0) + 10,
        streak: newStreak
      });
    }
  };
  

  const loginUsingEmailAndPassword = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await trackUserLogin(user); 
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
      await trackUserLogin(user);
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

      await trackUserLogin(user);

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

  const handlePasswordReset = async () => {
    const Email = prompt("Please enter your email address:");
    if (!Email) {
      toast.error("Email address is required!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, Email);
      toast.success("Password reset email sent successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to send password reset email!");
    }
  }

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
                <EyeOff size={22} className='mt-7' />
              ) : (
                <Eye size={22} className='mt-7' />
              )}
            </button>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => handlePasswordReset()}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Forgot Password?
            </button>
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
          <p className="text-center text-gray-400 text-sm">
          Don't have an account?{" "}
         <span 
             onClick={() => setSignupOpen(true)}
             className="text-purple-400 hover:text-purple-300 cursor-pointer"
           >
             Sign up 
           </span>
         </p>
         <SignupModal isOpen={signupOpen} onClose={() => setSignupOpen(false)} />
      </form>
      </div>
    </div>
  );
};

export default LoginModal;
