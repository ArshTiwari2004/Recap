import React from 'react';
import { Rocket, Zap, Cpu, Layers, Code, Users, FileText, Award } from 'lucide-react';

const ContentSection = ({ activeSection }) => {
  const getSectionIcon = (sectionId) => {
    switch (sectionId) {
      case 'overview':
        return <Rocket className="w-6 h-6 mr-2 text-purple-600" />;
      case 'problem-statement':
        return <FileText className="w-6 h-6 mr-2 text-purple-600" />;
      case 'features':
        return <Zap className="w-6 h-6 mr-2 text-purple-600" />;
      case 'usp':
        return <Award className="w-6 h-6 mr-2 text-purple-600" />;
      case 'tech-stack':
        return <Cpu className="w-6 h-6 mr-2 text-purple-600" />;
      case 'architecture':
        return <Layers className="w-6 h-6 mr-2 text-purple-600" />;
      case 'getting-started':
      case 'installation':
      case 'groq-integration':
        return <Code className="w-6 h-6 mr-2 text-purple-600" />;
      case 'team':
        return <Users className="w-6 h-6 mr-2 text-purple-600" />;
      default:
        return <FileText className="w-6 h-6 mr-2 text-purple-600" />;
    }
  };

  return (
    <main className="flex-1 p-8 ml-64 overflow-y-auto">
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

      {activeSection === 'features' && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6 flex items-center">
            {getSectionIcon('features')}
            Key Features
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Smart Note Organization</h3>
              <p className="text-gray-700">
                Automatic categorization by subject and topic with customizable viewing options to structure study material effectively.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Flashcard Generation</h3>
              <p className="text-gray-700">
                Automatic creation of study cards from your notes which you can revise later, transforming notes into interactive study aids.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">OCR Integration</h3>
              <p className="text-gray-700">
                Convert handwritten notes to digital text instantly, ensuring no valuable information is lost.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Audio Transcription</h3>
              <p className="text-gray-700">
                Convert lecture recordings to searchable text through advanced audio transcription tools.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Collaborative Learning</h3>
              <p className="text-gray-700">
                Share and create groups with peers, enabling real-time collaborative note-sharing and group activity tracking.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">AI-Powered Insights</h3>
              <p className="text-gray-700">
                Identify knowledge gaps and get personalized recommendations and resources based on performance analysis.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Other sections would follow the same pattern */}
      {/* I've shown a few sections as examples - the complete implementation would include all sections */}

    </main>
  );
};

export default ContentSection;