import React from 'react';
import { Copy } from 'lucide-react';

const InstallationSteps = () => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Installation Steps</h2>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-2">Clone the repository:</p>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            git clone https://github.com/ArshTiwari2004/Recap.git
            cd Recap
            cd Recap-frontend
          </pre>
          <button 
            onClick={() => copyToClipboard('git clone https://github.com/ArshTiwari2004/Recap.git\ncd Recap\ncd Recap-frontend')}
            className="absolute top-2 right-2 p-1 rounded bg-gray-700 text-white hover:bg-gray-600"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-700 mb-2">Install dependencies:</p>
        <div className="relative">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
            npm install
            # or
            yarn install
          </pre>
          <button 
            onClick={() => copyToClipboard('npm install\n# or\nyarn install')}
            className="absolute top-2 right-2 p-1 rounded bg-gray-700 text-white hover:bg-gray-600"
            title="Copy to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallationSteps;