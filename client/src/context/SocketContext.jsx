import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user && token) {
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('register-user', user._id);
      });

      newSocket.on('new-notification', (notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        // Play subtle sound?
      });

      setSocket(newSocket);

      // Fetch initial notifications
      fetchNotifications();

      return () => newSocket.close();
    }
  }, [user, token]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.isRead).length);
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    }
  };

  const markAllRead = async () => {
    try {
      await fetch('http://localhost:5000/api/v1/notifications/read-all', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, markAllRead }}>
      {children}
    </SocketContext.Provider>
  );
};
