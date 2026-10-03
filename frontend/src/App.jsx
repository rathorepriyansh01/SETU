import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { WebSocketProvider, useWebSocket } from './context/WebSocketContext';
import { Header } from './components/Header';
import { RoleNavigation } from './components/RoleNavigation';
import { PatientPage } from './pages/PatientPage';
import { DispatcherPage } from './pages/DispatcherPage';
import { HospitalPage } from './pages/HospitalPage';
import { AdminPage } from './pages/AdminPage';
import { Bell, X } from 'lucide-react';

const MainContent = () => {
  const { role } = useAuth();
  const { notifications } = useWebSocket();
  const [activeTab, setActiveTab] = useState('search');
  const [showToast, setShowToast] = useState(true);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {/* Shell Header */}
      <Header />

      {/* Role Navigation Bar */}
      <RoleNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Realtime WebSocket Toast Notification Banner */}
      {notifications.length > 0 && showToast && (
        <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <Bell className="w-3.5 h-3.5 text-teal-400 animate-bounce" />
            <span className="font-semibold text-teal-300">Live Grid Update:</span>
            <span className="text-slate-300">
              {notifications[0].type} — {JSON.stringify(notifications[0].data)}
            </span>
          </div>
          <button onClick={() => setShowToast(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Role Page Workspaces */}
      <main className="flex-1">
        {role === 'PATIENT' && <PatientPage activeTab={activeTab} />}
        {role === 'DISPATCHER' && <DispatcherPage activeTab={activeTab} />}
        {role === 'HOSPITAL_ADMIN' && <HospitalPage activeTab={activeTab} />}
        {role === 'HEALTH_OFFICER' && <AdminPage activeTab={activeTab} />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>SETU v2.0</strong> — Smart Emergency & Healthcare Resilience Platform for Bhopal, MP
          </div>
          <div className="text-slate-500">
            "Don't just find the nearest hospital. Find the right available capacity." • Demo Network
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <WebSocketProvider>
          <MainContent />
        </WebSocketProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
