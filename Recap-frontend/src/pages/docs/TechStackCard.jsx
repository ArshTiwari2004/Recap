import React from 'react';

const TechStackCard = ({ technology }) => {
  return (
    <div className="p-4 bg-white shadow rounded-lg text-center font-medium text-gray-800 hover:bg-purple-50 transition-colors">
      {technology}
    </div>
  );
};

export default TechStackCard;