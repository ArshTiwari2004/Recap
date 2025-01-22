import React, { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';
import { fireDB } from '@/config/Firebaseconfig';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?.uid) return;

    // Query notifications for the current user
    const notificationsRef = collection(fireDB, 'notifications');
    const q = query(
      notificationsRef,
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));
      setNotifications(newNotifications);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
    });

    // Click outside handler
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(fireDB, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read);
      const updatePromises = unreadNotifications.map(notification =>
        updateDoc(doc(fireDB, 'notifications', notification.id), { read: true })
      );
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconClasses = "w-8 h-8 p-1.5 rounded-full";
    switch (type) {
      case 'upload':
        return <div className={`${iconClasses} bg-purple-500/20 text-purple-500`}>📤</div>;
      case 'invite':
        return <div className={`${iconClasses} bg-blue-500/20 text-blue-500`}>👥</div>;
      case 'quiz':
        return <div className={`${iconClasses} bg-green-500/20 text-green-500`}>📝</div>;
      case 'ai':
        return <div className={`${iconClasses} bg-yellow-500/20 text-yellow-500`}>🤖</div>;
      default:
        return <div className={`${iconClasses} bg-gray-500/20 text-gray-500`}>📢</div>;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white transition-colors rounded-full hover:bg-gray-700/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-h-[32rem] overflow-y-auto bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-50">
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Notifications</h3>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Mark all as read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-700/50 transition-colors flex items-start space-x-4 ${
                    !notification.read ? 'bg-gray-700/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {notification.createdAt
                        ? formatDistanceToNow(notification.createdAt, { addSuffix: true })
                        : 'Just now'}
                    </p>
                  </div>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-2"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;