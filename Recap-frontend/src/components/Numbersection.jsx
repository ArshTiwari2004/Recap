import React from 'react';
import { TrendingUp } from 'lucide-react';

const MetricCard = ({ title, value, trend }) => {
  return (
    <div className="flex flex-col bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-lg transition-all hover:scale-105 hover:bg-white/15 h-24 w-64">
      <div className="text-purple-300 text-xs font-medium mb-1 line-clamp-1">{title}</div>
      <div className="flex items-end gap-2 mt-auto">
        <div className="text-white text-4xl font-bold tracking-tight">{value}</div>
        {trend && (
          <div className="flex items-center text-green-400 text-xs mb-1">
            <TrendingUp size={12} className="mr-1" />
            {trend}
          </div>
        )}
      </div>
    </div>
  );
};

const Numbersection = () => {
  const metrics = [
    { title: "Total Users", value: "20+" },
    { title: "Active Users (Daily)", value: "10+" },
    { title: "New Users This Month", value: "20+" },
    { title: "Total Feedback Received", value: "20+" }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <div className="flex flex-col items-center">
        <div className="mb-6 text-center">
          <h2 className="text-white text-xl font-medium mb-2">Platform Metrics</h2>
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-violet-300 rounded-full mx-auto"></div>
        </div>
        
        <div className="flex flex-row gap-4 w-full justify-center">
          {metrics.map((metric, index) => (
            <MetricCard 
              key={index}
              title={metric.title}
              value={metric.value}
              trend={metric.trend}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Numbersection;