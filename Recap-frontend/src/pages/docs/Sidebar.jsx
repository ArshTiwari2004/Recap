import React from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = [
    { id: 'overview', name: 'Overview' },
    { id: 'problem-statement', name: 'Problem Statement' },
    { id: 'features', name: 'Key Features' },
    { id: 'usp', name: 'Unique Selling Points' },
    { id: 'tech-stack', name: 'Tech Stack' },
    { id: 'architecture', name: 'Architecture' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'installation', name: 'Installation' },
    { id: 'groq-integration', name: 'Groq Integration' },
    { id: 'team', name: 'Our Team' },
    { id: 'contributing', name: 'Contributing' },
    { id: 'license', name: 'License' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 hidden md:block fixed h-full overflow-y-auto">
      <h2 className="text-xl font-bold text-purple-600 mb-6 flex items-center">
        <BookOpen className="w-5 h-5 mr-2" />
        Recap Documentation
      </h2>
      <nav className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
              activeSection === section.id
                ? 'bg-purple-50 text-purple-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>{section.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;