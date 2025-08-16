import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ContentSection from './ContentSection';

const DocsFinal = () => {
  const [activeSection, setActiveSection] = useState('overview');

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <ContentSection activeSection={activeSection} />
    </div>
  );
};

export default DocsFinal;