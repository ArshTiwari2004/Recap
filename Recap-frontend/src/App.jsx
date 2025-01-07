import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/Landingpage'
import Premium from './pages/Premium'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/premium" element={<Premium />} />
        </Routes>
    </Router>
  )
}


export default App;
