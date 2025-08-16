import React from 'react';
import { Github, Linkedin, Twitter } from 'lucide-react';

const TeamMember = ({ name, github, linkedin, twitter }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
      <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center text-purple-600 text-2xl font-bold">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <div className="flex justify-center space-x-4">
        <a href={github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600">
          <Github className="w-5 h-5" />
        </a>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600">
          <Linkedin className="w-5 h-5" />
        </a>
        <a href={twitter} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-purple-600">
          <Twitter className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

export default TeamMember;