import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Controlla se esiste una preferenza salvata nel localStorage
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Salva la preferenza nel localStorage quando cambia
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  // Funzione per alternare tra tema chiaro e scuro
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = {
    mode,
    toggleColorMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode deve essere usato all\'interno di un ThemeProvider');
  }
  return context;
};

export default ThemeContext; 