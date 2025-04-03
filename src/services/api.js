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
  transcribe: async (audioBlob, recordingId = null) => {
    try {
      const formData = new FormData();
      
      if (recordingId) {
        // Se abbiamo un recordingId, lo inviamo senza caricare nuovamente il file
        formData.append('recordingId', recordingId);
        console.log(`Utilizzando recordingId esistente: ${recordingId}`);
      } else if (audioBlob) {
        // Altrimenti carichiamo il file audio
        formData.append('audio', audioBlob, 'recording.mp3');
        console.log(`Caricando nuovo file audio: ${audioBlob.size} bytes`);
      } else {
        throw new Error('È necessario fornire un file audio o un recordingId');
      }
      
      console.log('Invio richiesta trascrizione...');
      const response = await api.post('/transcribe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload in corso: ${percentCompleted}%`);
        }
      });
      
      console.log('Risposta trascrizione:', response.data);
      
      // Verifica che nella risposta ci sia un recordingId
      if (!response.data.recordingId) {
        console.warn('Nessun recordingId nella risposta');
        throw new Error('Il server non ha restituito un recordingId valido. L\'upload potrebbe non essere stato completato.');
      }
      
      return response.data;
    } catch (error) {
      // Miglioriamo la gestione degli errori per mostrare messaggi più chiari
      console.error('Errore durante la trascrizione:', error);
      
      let errorMessage = 'Errore durante la trascrizione del file audio';
      
      if (error.response) {
        console.error('Dettagli errore dal server:', error.response.data);
        
        // Estrai messaggi di errore specifici dalla risposta
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
          
          // Aggiungi dettagli se disponibili
          if (error.response.data.details) {
            errorMessage += `: ${error.response.data.details}`;
          }
        }
        
        // Gestione di errori HTTP specifici
        if (error.response.status === 400) {
          errorMessage = `Richiesta non valida: ${errorMessage}`;
        } else if (error.response.status === 401) {
          errorMessage = 'Sessione scaduta. Effettua nuovamente il login.';
        } else if (error.response.status === 413) {
          errorMessage = 'Il file audio è troppo grande. La dimensione massima è 100MB.';
        } else if (error.response.status === 415) {
          errorMessage = 'Formato file non supportato. Utilizza formato MP3 o WAV.';
        } else if (error.response.status === 501) {
          errorMessage = 'Servizio di storage non configurato. Contatta l\'amministratore.';
        } else if (error.response.status >= 500) {
          errorMessage = `Errore del server: ${errorMessage}`;
        }
        
        throw new Error(errorMessage);
      } else if (error.request) {
        // Errore di rete, nessuna risposta ricevuta
        throw new Error('Impossibile comunicare con il server. Verifica la tua connessione di rete.');
      }
      
      // Errore generico
      throw error;
    }
  },
  
  // Controlla lo stato della trascrizione
  checkStatus: async (operationId, recordingId) => {
    try {
      console.log(`Verifica stato trascrizione: ${operationId}, recording: ${recordingId}`);
      
      // Verifica che ci sia un operationId
      if (!operationId) {
        throw new Error('ID operazione mancante. Impossibile verificare lo stato.');
      }
      
      // Verifica che ci sia un recordingId
      if (!recordingId) {
        throw new Error('Recording ID mancante. Impossibile verificare lo stato.');
      }
      
      const response = await api.get(`/transcribe/status/${operationId}`, {
        params: { recordingId }
      });
      return response.data;
    } catch (error) {
      console.error('Errore durante il controllo dello stato della trascrizione:', error);
      throw error;
    }
  },
  
  // Elimina una trascrizione e tutti i dati associati
  deleteTranscription: async (transcriptionId) => {
    try {
      if (!transcriptionId) {
        throw new Error('ID trascrizione mancante. Impossibile eliminare la trascrizione.');
      }
      
      console.log(`Eliminazione trascrizione: ${transcriptionId}`);
      const response = await api.delete(`/transcribe/${transcriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Errore durante l\'eliminazione della trascrizione:', error);
      throw error;
    }
  }
};

// Servizio per l'analisi del testo
export const analysisService = {
  // Analizza un testo trascritto
  analyze: async (params) => {
    try {
      const { text, transcriptionId, forceReanalysis, audioFilename } = params;
      
      if (!text || !transcriptionId) {
        throw new Error('Testo o ID trascrizione mancanti');
      }
      
      const data = {
        text,
        transcriptionId,
        forceReanalysis: !!forceReanalysis
      };
      
      // Aggiungi il nome del file audio solo se presente
      if (audioFilename) {
        data.audioFilename = audioFilename;
      }
      
      const response = await api.post('/analyze', data);
      return response.data.analysis;
    } catch (error) {
      console.error('Errore durante l\'analisi del testo:', error);
      throw error;
    }
  },
  
  // Recupera la cronologia delle analisi
  getAnalysisHistory: async (limit = 10, skip = 0) => {
    try {
      const response = await api.get('/analyze', {
        params: { limit, skip }
      });
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero della cronologia delle analisi:', error);
      throw error;
    }
  },

  // Recupera un'analisi specifica
  getAnalysis: async (id) => {
    try {
      const response = await api.get(`/analyze/${id}`);
      return response.data.analysis;
    } catch (error) {
      console.error('Errore nel recupero dell\'analisi:', error);
      throw error;
    }
  }
};

// Servizio per la dashboard
export const dashboardService = {
  // Recupera le statistiche della dashboard
  getStats: async () => {
    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero delle statistiche:', error);
      throw error;
    }
  },
  
  // Recupera la cronologia delle trascrizioni
  getHistory: async (limit = 10, skip = 0) => {
    try {
      const response = await api.get('/dashboard/history', {
        params: { limit, skip }
      });
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero della cronologia:', error);
      throw error;
    }
  },

  // Ottiene l'URL di download per un file audio
  getAudioDownloadUrl: async (audioId) => {
    // Restituisci direttamente l'URL completo dell'endpoint, dato che ora restituisce il file binario
    return `${API_URL}/audio/${audioId}`;
  }
};

// Inizializza gli interceptor
setupInterceptors();

// Crea l'oggetto export
const apiServices = {
  authService,
  transcriptionService,
  analysisService,
  dashboardService
};

export default apiServices; 