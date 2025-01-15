import React from 'react';
import { X } from 'lucide-react';
import { ButtonsCard } from '../components/ui/tailwindcss-buttons';
import { createUserWithEmailAndPassword, GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth,fireDB } from '../config/Firebaseconfig.js';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { Timestamp, addDoc, collection } from 'firebase/firestore'
import LoginModal from './LoginModal';

const SignupModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const [loginOpen, setLoginOpen] = useState(false);

   const handleSignup = async(e)=>{
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      toast.error('All fields are required!');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await addDoc(collection(fireDB, 'users'), {
        uid: user.uid,
        firstName,
        lastName,
        email,
        createdAt: Timestamp.now(),
      });
      toast.success('Account created successfully!');
      navigate('/main-dashboard');
    } catch (error) {
      toast.error(error.message);
    }
   }

   const handleGithubSignup = async () => {
    try {
      const githubProvider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;

      // Save user info to Firestore if necessary
      await addDoc(collection(fireDB, 'users'), {
        uid: user.uid,
        displayName: user.displayName || 'Github User',
        email: user.email,
        createdAt: Timestamp.now(),
        provider: 'github',
      });

      toast.success('Signed up with GitHub successfully!');
      navigate('/main-dashboard');
    } catch (error) {
      toast.error(`GitHub Signup Failed: ${error.message}`);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const googleProvider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
  
      // Store user information in local storage or handle it as needed
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.displayName || user.email}!`);
      navigate('/main-dashboard');
      console.log("User Info:", user);
    } catch (error) {
      console.error("Error during Google Sign-In:", error.code, error.message);
      toast.error(error.message || "Google Sign-In failed!");
    }
  };
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-2xl border border-purple-500/50 w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-300 block mb-2">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-2">Password</label>
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-700 text-white focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
          >
            Sign Up
          </button>
        </form>
        <button
          onClick={handleGithubSignup}
          className="w-full border border-gray-700 hover:border-gray-600 text-white py-3 flex items-center justify-center gap-2 mt-4"
        >
          <img src="/github.svg" alt="GitHub" className="w-5 h-5" />
          Sign Up with GitHub
        </button>
        <button
          onClick={handleGoogleSignUp}
          className="w-full border border-gray-700 hover:border-gray-600 text-white py-3 flex items-center justify-center gap-2 mt-4"
        >
          <img src="/google.svg" alt="GitHub" className="w-5 h-5" />
          Sign Up with Google
        </button>
        <p className="text-sm text-gray-400 text-center mt-4">
          By creating an account, you agree to Recap's{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Use</a> and{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
        </p>
        <p className="text-center text-gray-400 text-sm mt-2">
  Already have an account? 
  <span 
    onClick={() => setLoginOpen(true)} 
    className="text-purple-400 hover:text-purple-300 cursor-pointer  ml-1"
  >
    Log in
  </span>
</p>
<LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />

      </div>
    </div>
  );
};

export default SignupModal;
