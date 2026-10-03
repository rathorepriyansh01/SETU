import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('setu_role') || 'PATIENT'); // PATIENT, DISPATCHER, HOSPITAL_ADMIN, HEALTH_OFFICER
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('setu_token') || null);
  const [activeHospitalId, setActiveHospitalId] = useState(1); // Default AIIMS Bhopal

  const login = async (email, password) => {
    const res = await api.login(email, password);
    setToken(res.access_token);
    setRole(res.role);
    setUser({ id: res.user_id, name: res.name, email, role: res.role, hospital_id: res.hospital_id });
    if (res.hospital_id) setActiveHospitalId(res.hospital_id);
    localStorage.setItem('setu_token', res.access_token);
    localStorage.setItem('setu_role', res.role);
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setRole('PATIENT');
    localStorage.removeItem('setu_token');
    localStorage.removeItem('setu_role');
  };

  const switchRole = (newRole, hospitalId = 1) => {
    setRole(newRole);
    setActiveHospitalId(hospitalId);
    localStorage.setItem('setu_role', newRole);
  };

  return (
    <AuthContext.Provider value={{
      role,
      user,
      token,
      activeHospitalId,
      setActiveHospitalId,
      switchRole,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
