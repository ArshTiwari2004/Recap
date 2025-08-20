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
import FeedbackForm from './pages/Feedback';
import UserLeaderBoard from './components/LeaderBoard';
import Maindashboard from './pages/Maindashboard';
import { FirebaseProvider } from './context/FirebaseContext';
import OCRScanner from './pages/OCRscanner';
import Error404 from './Error404';
import PDFOCRScanner from './pages/Ocrpdf';
import PYQPractice from './components/PYQpractice';
import CommunityContent from './components/CommunityContent';
import HelpPage from './pages/Help';
import DocsFinal from './pages/docs/DocsFinal';
import ProfileAndSettings from './pages/ProfileandSettings/ProfileandSettings';
import AIQuestionBank from './pages/AIQuestionBank';
import ViewMyNotes from './pages/ViewMyNotes';

const App = () => {
  return (
    <>
    <Toaster />
    <Router>
      <FirebaseProvider>
      
        <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/premium" element={<Premium />} />
        <Route path="/sidebar" element={<Sidebar />} />
        <Route path="/upload-note" element={<Dashboard />} />
        <Route path="/my-notes" element={<MyNotes />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/leaderboard" element={<UserLeaderBoard />} />
        
        <Route path="/collaboration" element={<CollaborativeNotes />} />
        <Route path="/community" element={<CommunityContent />} />
     
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/ai-insights" element={<AIInsights />} />
   
      
        <Route path="/main-dashboard" element={<Maindashboard />} />
        <Route path="/ocr" element={<OCRScanner />} />
        <Route path="*" element={<Error404 />} />
        <Route path="/pdf-ocr" element={<PDFOCRScanner />} />
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/pyq-practice" element={<PYQPractice />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/aiquestionbank" element={<AIQuestionBank />} />
        <Route path="/docs" element={<DocsFinal />} />
        <Route path="/profile-settings" element={<ProfileAndSettings />} />
        <Route path="/my-notes/:id" element={<ViewMyNotes />} />

        </Routes>
       
        </FirebaseProvider>
    </Router>
    </>
  )
}


export default App;
