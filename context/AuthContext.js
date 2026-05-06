import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    nim_mhs: '0920240024',
    name: 'Arsalan Muflih Zakaria',
    class: 'Informatika-2B'
  });

  return (
    <AuthContext.Provider value={{ userData, setUserData }}>
      {children}
    </AuthContext.Provider>
  );
};