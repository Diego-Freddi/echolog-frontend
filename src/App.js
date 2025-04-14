import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useThemeMode } from './contexts/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Record from './pages/Record';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Analysis from './pages/Analysis';
import Usage from './pages/Usage';
import TextAnalyzer from './pages/TextAnalyzer';

// Importa il client ID dalle variabili d'ambiente
if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
  console.error('REACT_APP_GOOGLE_CLIENT_ID non è definito nelle variabili d\'ambiente');
}

// Componente wrapper per le rotte protette
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Caricamento...</div>; // Sostituiremo questo con un componente di loading
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <MainLayout>{children}</MainLayout>;
};

// Componente che applica il tema MUI
const ThemeConfig = ({ children }) => {
  const { mode } = useThemeMode();
  
  // Creazione tema MUI basato sulla modalità (chiara o scura)
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // Manteniamo i colori primari e secondari coerenti con il design esistente
          primary: {
            main: '#f02c56',
          },
          secondary: {
            main: '#7c32ff',
          },
          background: {
            default: mode === 'light' ? '#f5f5f7' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e'
          }
        },
      }),
    [mode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <ThemeConfig>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/record" element={
                  <ProtectedRoute>
                    <Record />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/analysis/:id" element={
                  <ProtectedRoute>
                    <Analysis />
                  </ProtectedRoute>
                } />
                <Route path="/usage" element={
                  <ProtectedRoute>
                    <Usage />
                  </ProtectedRoute>
                } />
                <Route path="/text-analyzer" element={
                  <ProtectedRoute>
                    <TextAnalyzer />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Usage />
                  </ProtectedRoute>
                } />
              </Routes>
            </Router>
          </AuthProvider>
        </ThemeConfig>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
