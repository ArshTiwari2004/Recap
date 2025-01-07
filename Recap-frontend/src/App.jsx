import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/Landingpage'
import Premium from './pages/Premium'
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard/Uploadnotes';
import MyNotes from './pages/Dashboard/Mynotes';
import Flashcards from './components/Flashcards/Flashcards';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/upload-note" element={<Dashboard />} />
        <Route path="/my-notes" element={<MyNotes />} />
        <Route path="/flashcards" element={<Flashcards />} />
        </Routes>
    </Router>
  )
}


export default App;
