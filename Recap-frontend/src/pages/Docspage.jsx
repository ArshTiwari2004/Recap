import React from "react";
import { BookOpen, Cpu, Rocket, Users, Settings } from "lucide-react";

const DocsPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block">
        <h2 className="text-xl font-bold text-purple-600 mb-6 flex items-center">
          <BookOpen className="w-5 h-5 mr-2" />
          Recap Docs
        </h2>
        <nav className="space-y-4 text-sm font-medium">
          <a href="#overview" className="block hover:text-purple-600">📌 Overview</a>
          <a href="#features" className="block hover:text-purple-600">🌟 Features</a>
          <a href="#getting-started" className="block hover:text-purple-600">🚀 Getting Started</a>
          <a href="#installation" className="block hover:text-purple-600">⚙️ Installation</a>
          <a href="#tech-stack" className="block hover:text-purple-600">🛠️ Tech Stack</a>
          <a href="#api" className="block hover:text-purple-600">📖 API Integration</a>
          <a href="#team" className="block hover:text-purple-600">👥 Team</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Overview */}
        <section id="overview" className="mb-12">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Rocket className="w-7 h-7 mr-2 text-purple-600" /> Overview
          </h1>
          <p className="text-gray-700 leading-relaxed">
            <strong>Recap</strong> is an AI-powered study companion that adapts to your learning style. 
            Capture, connect, and master your study materials effortlessly with intelligent note organization, 
            flashcards, OCR, audio transcription, and more.
          </p>
        </section>

        {/* Features */}
        <section id="features" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🌟 Key Features</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Smart Note Organization by subject & topic</li>
            <li>Automatic Flashcard Generation for quick revision</li>
            <li>OCR Integration to digitize handwritten notes</li>
            <li>Audio Transcription of lecture recordings</li>
            <li>Collaborative Learning with peers</li>
            <li>AI-Powered Insights to identify knowledge gaps</li>
            <li>Gamified Learning with streaks & quizzes</li>
          </ul>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">🚀 Getting Started</h2>
          <p className="text-gray-700 mb-4">
            To get started with Recap, ensure you have the following prerequisites installed:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-4">
            <li>Node.js 18+</li>
            <li>npm or yarn</li>
            <li>Firebase Account</li>
            <li>AssemblyAI API key</li>
            <li>Groq API key</li>
          </ul>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`git clone https://github.com/ArshTiwari2004/Recap.git
cd Recap/Recap-frontend
npm install
npm run dev`}
          </pre>
        </section>

        {/* Installation */}
        <section id="installation" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">⚙️ Installation & Setup</h2>
          <p className="text-gray-700 mb-4">
            Copy the <code>.env.example</code> file and configure environment variables:
          </p>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`cp .env.example .env.local

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_ASSEMBLYAI_API_KEY=your_assemblyai_api_key
VITE_GROQ_API_KEY=your_groq_api_key`}
          </pre>
        </section>

        {/* Tech Stack */}
        <section id="tech-stack" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-purple-600" /> Tech Stack
          </h2>
          <p className="text-gray-700 mb-4">Recap is built using a modern and scalable tech stack:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
            <div className="p-4 bg-white shadow rounded-lg">React.js + Tailwind CSS</div>
            <div className="p-4 bg-white shadow rounded-lg">Firebase + Firestore</div>
            <div className="p-4 bg-white shadow rounded-lg">AssemblyAI</div>
            <div className="p-4 bg-white shadow rounded-lg">Cohere AI</div>
            <div className="p-4 bg-white shadow rounded-lg">Groq API</div>
            <div className="p-4 bg-white shadow rounded-lg">Docker + Kubernetes</div>
          </div>
        </section>

        {/* API */}
        <section id="api" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">📖 API Integration</h2>
          <p className="text-gray-700 mb-4">
            Recap leverages multiple APIs for advanced functionality:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>AssemblyAI:</strong> Audio transcription</li>
            <li><strong>Cohere:</strong> AI-powered insights & recommendations</li>
            <li><strong>Groq:</strong> High-performance AI inference for chatbot, PYQ generator, and smart tests</li>
          </ul>
        </section>

        {/* Team */}
        <section id="team" className="mb-12">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-600" /> Team Synapse
          </h2>
          <p className="text-gray-700 mb-4">The brilliant minds behind Recap:</p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Arsh Tiwari – GitHub | LinkedIn | Twitter</li>
            <li>Priyanshi Bothra – GitHub | LinkedIn | Twitter</li>
            <li>Nibedan Pati – GitHub | LinkedIn | Twitter</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default DocsPage;
