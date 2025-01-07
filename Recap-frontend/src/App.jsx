import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/Landingpage'
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <>
    <Toaster />
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        </Routes>
    </Router>
    </>
  )
}


export default App;
