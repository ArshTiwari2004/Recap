import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/Landingpage'
import { Toaster } from 'react-hot-toast';
import Premium from './pages/Premium'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Uploadnotes';
import MyNotes from './pages/Dashboard/Mynotes';
import Flashcards from './components/Flashcards/Flashcards';
import CollaborativeNotes from './components/Collaboration/Collaborations';
import Quizzes from './components/Quiz/Quiz';
import AIInsights from './components/AISuggestions/AIinsights';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

import Maindashboard from './pages/Maindashboard';

const App = () => {
  return (
    <>
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/upload-note" element={<Dashboard />} />
        <Route path="/my-notes" element={<MyNotes />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/collaboration" element={<CollaborativeNotes />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/settings" element={<Settings />} />
        
        </Routes>
    </Router>
    </>
  )
}


export default App;
