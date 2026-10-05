import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getWsUrl = () => {
      const envApiUrl = import.meta.env.VITE_API_BASE_URL || 'https://setu-ffwk.onrender.com/api';
      const baseUrl = envApiUrl.replace(/\/api\/?$/, '');
      return baseUrl.replace(/^http/, 'ws') + '/ws/live';
    };

    const wsUrl = getWsUrl();
    let ws;

    const connect = () => {
      try {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          setIsConnected(true);
          console.log("WebSocket connected to SETU Live Feed");
        };

        ws.onmessage = (event) => {
          try {
            const parsed = JSON.parse(event.data);
            setLastMessage(parsed);
            if (parsed.type && parsed.type !== 'PONG') {
              setNotifications(prev => [parsed, ...prev.slice(0, 19)]);
            }
          } catch (e) {
            console.error("Failed to parse WS message", e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Try reconnect in 3s
          setTimeout(connect, 3000);
        };

        ws.onerror = (err) => {
          console.warn("WebSocket error:", err);
          ws.close();
        };

        setSocket(ws);
      } catch (e) {
        console.error("WS setup failed", e);
      }
    };

    connect();

    return () => {
      if (ws) ws.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ isConnected, lastMessage, notifications, socket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
