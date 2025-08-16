import React from 'react';
import { Rocket, AlertCircle, Zap, Award, Cpu, Layers, Code, Users, FileText, GitBranch, Scale } from 'lucide-react';
import FeatureCard from './FeatureCard';
import TechStackCard from './TechStackCard';
import TeamMember from './TeamMember';
import InstallationSteps from './InstallationSteps';

const ContentSection = ({ activeSection }) => {
  const getSectionIcon = (sectionId) => {
    const icons = {
      'overview': <Rocket className="w-6 h-6 mr-2 text-purple-600" />,
      'problem-statement': <AlertCircle className="w-6 h-6 mr-2 text-purple-600" />,
      'features': <Zap className="w-6 h-6 mr-2 text-purple-600" />,
      'usp': <Award className="w-6 h-6 mr-2 text-purple-600" />,
      'tech-stack': <Cpu className="w-6 h-6 mr-2 text-purple-600" />,
      'architecture': <Layers className="w-6 h-6 mr-2 text-purple-600" />,
      'getting-started': <Code className="w-6 h-6 mr-2 text-purple-600" />,
      'installation': <Code className="w-6 h-6 mr-2 text-purple-600" />,
      'groq-integration': <Code className="w-6 h-6 mr-2 text-purple-600" />,
      'team': <Users className="w-6 h-6 mr-2 text-purple-600" />,
      'contributing': <GitBranch className="w-6 h-6 mr-2 text-purple-600" />,
      'license': <Scale className="w-6 h-6 mr-2 text-purple-600" />
    };
    return icons[sectionId] || <FileText className="w-6 h-6 mr-2 text-purple-600" />;
  };

  const features = [
    {
      title: "Smart Note Organization",
      description: "Automatic categorization by subject and topic with customizable viewing options to structure study material effectively."
    },
    {
      title: "Flashcard Generation",
      description: "Automatic creation of study cards from your notes which you can revise later, transforming notes into interactive study aids."
    },
    {
      title: "OCR Integration",
      description: "Convert handwritten notes to digital text instantly, ensuring no valuable information is lost."
    },
    {
      title: "Audio Transcription",
      description: "Convert lecture recordings to searchable text through advanced audio transcription tools."
    },
    {
      title: "Collaborative Learning",
      description: "Share and create groups with peers, enabling real-time collaborative note-sharing and group activity tracking."
    },
    {
      title: "AI-Powered Insights",
      description: "Identify knowledge gaps and get personalized recommendations and resources based on performance analysis."
    }
  ];

  const techStack = {
    frontend: ["React.js", "Tailwind CSS", "shadcn UI", "JavaScript", "Tesseract.js"],
    backend: ["Node.js", "Firebase Authentication", "Google OAuth", "Firebase", "Firestore Database"],
    api: ["Assembly AI API", "Cohere AI API", "Groq API"],
    devops: ["Vercel", "Git & GitHub", "Docker", "Kubernetes"]
  };

  const teamMembers = [
    {
      name: "Arsh Tiwari",
      github: "https://github.com/ArshTiwari2004",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Priyanshi Bothra",
      github: "#",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Nibedan Pati",
      github: "#",
      linkedin: "#",
      twitter: "#"
    }
  ];

  return (
    <main className="flex-1 p-8 ml-64 overflow-y-auto">
      {/* Overview Section */}
      {activeSection === 'overview' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('overview')}
            Overview
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 leading-relaxed mb-4">
              Recap is an AI-powered study companion designed to revolutionize the way students learn, revise, 
              and interact with their academic content. In today's fast-paced academic environment, students 
              face the constant challenge of managing vast amounts of study material, staying organized, and 
              preparing effectively for examinations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              At its core, Recap leverages artificial intelligence to evaluate Previous Year Question (PYQ) answers, 
              pinpoint individual weak areas, and generate personalized revision plans tailored to each learner's 
              unique needs. This targeted approach ensures students can focus their time and energy on topics 
              that require the most attention, resulting in more efficient and impactful preparation.
            </p>
          </div>
        </section>
      )}

      {/* Problem Statement Section */}
      {activeSection === 'problem-statement' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('problem-statement')}
            Problem Statement
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Key Challenges in Modern Education</h2>
            <ul className="list-disc list-inside space-y-3 text-gray-700">
              <li>85% of students solve Previous Year Questions but lack proper feedback on their answers, leading to inefficient revision</li>
              <li>Over 70% of students rely on last-minute cramming due to poor retention and scattered study materials</li>
              <li>Traditional note-taking methods are passive, with students spending 60% more time re-reading instead of actively improving weak areas</li>
              <li>No existing platform provides a complete AI-driven ecosystem that evaluates answers, pinpoints weaknesses, and creates personalized study plans</li>
              <li>Personalized learning improves retention by 50%, yet most students lack tailored feedback</li>
            </ul>
          </div>
        </section>
      )}

      {/* Features Section */}
      {activeSection === 'features' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('features')}
            Key Features
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* USP Section */}
      {activeSection === 'usp' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('usp')}
            Unique Selling Points
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Test Generator and Teacher Assistance</h3>
                <p className="text-gray-700">
                  Powered by Groq AI, our test generator creates customized assessments based on student needs and 
                  provides detailed analytics for teachers to track class performance.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">AI Powered PYQ Generator</h3>
                <p className="text-gray-700">
                  Our system analyzes patterns in previous year questions and generates similar practice questions 
                  with detailed solutions and performance metrics.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Progressive Web Application</h3>
                <p className="text-gray-700">
                  Recap works offline and can be installed as a native app on any device, providing seamless 
                  access to study materials anywhere, anytime.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Crowdsourced Learning Hub</h3>
                <p className="text-gray-700">
                  Community-driven content with gamification elements that encourage knowledge sharing and 
                  collaborative learning among students.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Tech Stack Section */}
      {activeSection === 'tech-stack' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('tech-stack')}
            Tech Stack
          </h1>
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Frontend</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {techStack.frontend.map((tech, index) => (
                  <TechStackCard key={`frontend-${index}`} technology={tech} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Backend</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {techStack.backend.map((tech, index) => (
                  <TechStackCard key={`backend-${index}`} technology={tech} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">APIs Used</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {techStack.api.map((tech, index) => (
                  <TechStackCard key={`api-${index}`} technology={tech} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">DevOps & Deployment</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {techStack.devops.map((tech, index) => (
                  <TechStackCard key={`devops-${index}`} technology={tech} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Architecture Section */}
      {activeSection === 'architecture' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('architecture')}
            Architecture
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">System Architecture</h2>
              <p className="text-gray-700 mb-4">
                Recap follows a modern, scalable architecture designed for performance and reliability:
              </p>
              <img 
                src="architecture.png"
                alt="Recap Architecture Diagram" 
                className="w-full h-auto rounded-lg border border-gray-200"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Tech Flow</h2>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>Frontend Development: Built with React.js and styled using Tailwind CSS</li>
                <li>Authentication System: Firebase Authentication with OAuth support</li>
                <li>Hosting and Deployment: Hosted on Vercel for optimized performance</li>
                <li>Data Storage: Firestore for real-time synchronization and scalability</li>
                <li>OCR and Audio Processing: Tesseract.js for OCR, Assembly AI for transcription</li>
                <li>AI-Powered Features: Cohere API for knowledge gap detection</li>
                <li>Flashcards and Quizzes: Dynamic generation with gamification elements</li>
                <li>Collaboration Features: Real-time group features via Firebase Context API</li>
                <li>Backend Services: Node.js server with Firebase APIs</li>
                <li>Analytics: Firebase Analytics for user interaction tracking</li>
                <li>Scalability: Docker containerization for production environments</li>
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* Getting Started Section */}
      {activeSection === 'getting-started' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('getting-started')}
            Getting Started
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Prerequisites</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li>Node.js 18.0 or higher</li>
              <li>npm or yarn package manager</li>
              <li>Firebase account</li>
              <li>AssemblyAI account for the API key</li>
              <li>Groq API key</li>
            </ul>
            
            <InstallationSteps />
          </div>
        </section>
      )}

      {/* Installation Section */}
      {activeSection === 'installation' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('installation')}
            Installation
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Environment Setup</h2>
            <p className="text-gray-700 mb-4">
              Copy the <code className="bg-gray-100 px-2 py-1 rounded">.env.example</code> file and configure environment variables:
            </p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mb-6">
{`cp .env.example .env.local

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_ASSEMBLYAI_API_KEY=your_assemblyai_api_key
VITE_GROQ_API_KEY=your_groq_api_key`}
            </pre>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Development Server</h2>
            <p className="text-gray-700 mb-2">Run the development server:</p>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
{`npm run dev
# or
yarn dev`}
            </pre>
            <p className="text-gray-700 mt-4">
              Open <a href="http://localhost:5173" className="text-purple-600 hover:underline">http://localhost:5173</a> in your browser
            </p>
          </div>
        </section>
      )}

      {/* Groq Integration Section */}
      {activeSection === 'groq-integration' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('groq-integration')}
            Groq Integration
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">About Groq</h2>
              <p className="text-gray-700">
                Groq is revolutionizing AI inference by providing ultra-fast, energy-efficient solutions tailored for 
                deploying and running AI models. The Groq Language Processing Unit (LPU) is purpose-built for AI tasks, 
                delivering unparalleled speed and efficiency compared to traditional GPUs.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Groq in Recap</h2>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-1">AI-Powered Chatbot</h3>
                  <p className="text-gray-700">
                    Utilizing Groq's API, our chatbot offers real-time, accurate responses, effectively addressing 
                    user queries and providing instant assistance.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-1">PYQ Generator and Analysis</h3>
                  <p className="text-gray-700">
                    Groq's API facilitates the generation of relevant questions and provides detailed analysis of 
                    student responses, including scoring and mistake identification.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-purple-800 mb-1">Smart Test Feature</h3>
                  <p className="text-gray-700">
                    Groq enables the creation of customized tests based on user-defined parameters like duration, 
                    subject, and difficulty level, with automatic evaluation and ranking.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-3 text-gray-800">Technical Implementation</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Obtain a Groq API Key from the Groq Developer Console</li>
                <li>Set up environment variables as shown in the Installation section</li>
                <li>Install the Groq client in your project: <code className="bg-gray-100 px-1 rounded">npm i groq-sdk</code></li>
                <li>Import and initialize the Groq client in your application</li>
              </ol>
            </div>
          </div>
        </section>
      )}

      {/* Team Section */}
      {activeSection === 'team' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('team')}
            Our Team
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Team Synapse</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {teamMembers.map((member, index) => (
                <TeamMember 
                  key={index}
                  name={member.name}
                  github={member.github}
                  linkedin={member.linkedin}
                  twitter={member.twitter}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contributing Section */}
      {activeSection === 'contributing' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('contributing')}
            Contributing
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p className="text-gray-700 mb-6">
              We welcome contributions from the community! Here's how you can help improve Recap:
            </p>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Contribution Guidelines</h2>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 mb-6">
              <li>Fork the repository</li>
              <li>Create your feature branch (<code className="bg-gray-100 px-1 rounded">git checkout -b feature/AmazingFeature</code>)</li>
              <li>Commit your changes (<code className="bg-gray-100 px-1 rounded">git commit -m 'Add some AmazingFeature'</code>)</li>
              <li>Push to the branch (<code className="bg-gray-100 px-1 rounded">git push origin feature/AmazingFeature</code>)</li>
              <li>Open a Pull Request</li>
            </ol>
            
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Reporting Issues</h2>
            <p className="text-gray-700 mb-2">
              If you encounter any bugs or have suggestions for improvements, please open an issue on our GitHub repository.
            </p>
            <a 
              href="https://github.com/ArshTiwari2004/Recap/issues" 
              className="text-purple-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Issues
            </a>
          </div>
        </section>
      )}

      {/* License Section */}
      {activeSection === 'license' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('license')}
            License
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">MIT License</h2>
            <p className="text-gray-700 mb-4">
              Copyright (c) 2023 Team Synapse
            </p>
            <p className="text-gray-700 mb-4">
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p className="text-gray-700 mb-4">
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p className="text-gray-700">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </section>
      )}
    </main>
  );
};

export default ContentSection;