import React, { useState } from 'react';
import { Bell } from 'lucide-react';

const NotificationDrop= () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    { id: 1, title: "New Message", desc:"Github Linked Succesfully", time: "2m ago" },
    { id: 2, title: "Quiz Completed", desc: "CSS Quiz completed", time: "1h ago" },
    { id: 3, title: "System Update", desc: "New features available", time: "2h ago" },
    { id: 4, title: "File Uploaded", desc: "File Uploaded Completed", time: "5h ago" }
  ];

  return (
    <div className="relative">

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg shadow-lg overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="px-4 py-3 border-b border-gray-700">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div 
                key={notification.id}
                className="px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700"
              >
                <p className="text-sm font-medium text-white">{notification.title}</p>
                <p className="text-sm text-gray-300">{notification.desc}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 bg-gray-900">
            <button className="w-full text-sm text-blue-400 hover:text-blue-300 py-1">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDrop;