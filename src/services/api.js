import axios from 'axios';

// Configura l'istanza base di Axios
const API_URL = 'http://localhost:5050/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptors centralizzati per l'autenticazione
const setupInterceptors = () => {
  // Request interceptor per aggiungere il token
  api.interceptors.request.use(config => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  }, error => Promise.reject(error));

  // Response interceptor per gestire errori di autenticazione
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        // Logout automatico in caso di token scaduto/invalido
        localStorage.removeItem('user');
        // Reindirizza alla pagina di login se necessario
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
};

// Servizio di autenticazione
export const authService = {
  // Login con Google
  loginWithGoogle: async (userData) => {
    try {
      const response = await api.post('/auth/google', userData);
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Errore durante il login';
    }
  },

  // Verifica token
  verifyToken: async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        throw new Error('Token non trovato');
      }

      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      authService.logout();
      throw error.response?.data?.error || 'Sessione scaduta';
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('user');
  },

  // Recupera utente corrente
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Setup interceptor per compatibilità
  setupAxiosInterceptors: () => {
    setupInterceptors();
  }
};

// Servizio di trascrizione
export const transcriptionService = {
  // Invia file audio per la trascrizione
  transcribe: async (audioBlob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.mp3');
    
    const response = await api.post('/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload in corso: ${percentCompleted}%`);
      }
    });
    
    return response.data;
  },
  
  // Controlla lo stato della trascrizione
  checkStatus: async (operationId) => {
    const response = await api.get(`/transcribe/status/${operationId}`);
    return response.data;
  }
};

// Servizio per l'analisi del testo
export const analysisService = {
  // Analizza un testo con Gemini
  analyzeText: async (text, transcriptionId) => {
    try {
      const response = await api.post('/analyze', { 
        text,
        transcriptionId: transcriptionId || 'temp-' + Date.now() // Fornisci un ID temporaneo se non disponibile
      });
      return response.data;
    } catch (error) {
      console.error('Errore durante l\'analisi del testo:', error);
      throw error;
    }
  }
};

// Inizializza gli interceptor
setupInterceptors();

// Crea l'oggetto export
const apiServices = {
  authService,
  transcriptionService,
  analysisService
};

export default apiServices; 