import axios from 'axios';

// Configura l'istanza base di Axios
const API_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:5050/api';
  console.log('API_URL in produzione:', API_URL);


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
  loginWithGoogle: async (tokenData) => {
    try {
      console.log('Sending token to backend for verification...');
      const response = await api.post('/auth/google', tokenData, {
        timeout: 15000  // Timeout di 15 secondi
      });
      
      if (!response.data || !response.data.token) {
        console.error('Invalid response from server:', response.data);
        throw new Error('Risposta del server non valida');
      }
      
      // Aggiungi un timestamp al momento del login
      const userData = { 
        ...response.data, 
        timestamp: Date.now() 
      };
      
      console.log('Token verification successful, storing user data...');
      localStorage.setItem('user', JSON.stringify(userData));
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      
      // Log dettagliato dell'errore
      if (error.response) {
        console.error('Server response:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      
      throw new Error(error.response?.data?.error || 'Errore durante il login con Google');
    }
  },

  // Verifica token con fallback
  verifyToken: async () => {
    try {
      console.log('Verifying token...');
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        throw new Error('Token non trovato');
      }

      // Utilizza un timeout più lungo per la verifica del token
      const response = await api.get('/auth/verify', {
        timeout: 15000  // Timeout di 15 secondi
      });
      
      console.log('Token verified successfully');
      return response.data;
    } catch (error) {
      console.error('Token verification error:', error);
      
      // Se è un errore di timeout, possiamo provare a considerare l'utente ancora valido
      // se il token non è scaduto (basandoci sulla data di creazione memorizzata)
      if (error.code === 'ECONNABORTED' || (error.message && error.message.includes('timeout'))) {
        console.log('Verification timed out, checking local token expiry...');
        const user = JSON.parse(localStorage.getItem('user'));
        
        // Controlla la validità locale del token (se è stato salvato un timestamp)
        if (user && user.timestamp) {
          const tokenAge = Date.now() - user.timestamp;
          // Se il token ha meno di 6 giorni (il token dura 7 giorni), consideriamolo valido
          if (tokenAge < 6 * 24 * 60 * 60 * 1000) {
            console.log('Using cached user data due to timeout');
            return { user: user.user };
          }
        }
      }
      
      // Altrimenti, logout
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
  },

  // Crea una trascrizione da testo inserito direttamente
  transcribeFromText: async (text, title) => {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('È necessario fornire del testo da analizzare');
      }

      console.log(`Invio testo diretto per trascrizione: ${text.substring(0, 50)}...`);
      
      const response = await api.post('/transcribe/fromText', {
        text,
        title: title || `Testo diretto ${new Date().toLocaleString('it-IT')}`
      });
      
      return response.data;
    } catch (error) {
      console.error('Errore durante la trascrizione da testo:', error);
      
      let errorMessage = 'Errore durante la trascrizione da testo';
      
      if (error.response) {
        console.error('Dettagli errore dal server:', error.response.data);
        
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
          
          if (error.response.data.details) {
            errorMessage += `: ${error.response.data.details}`;
          }
        }
      } else if (error.request) {
        errorMessage = 'Impossibile comunicare con il server. Verifica la tua connessione di rete.';
      }
      
      throw new Error(errorMessage);
    }
  },
  
  // Carica e trascrive un file di testo (PDF, DOCX, TXT)
  transcribeFromFile: async (file) => {
    try {
      if (!file) {
        throw new Error('È necessario fornire un file');
      }
      
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
      
      if (!allowedExtensions.includes(fileExtension)) {
        throw new Error(`Formato file non supportato: ${fileExtension}. Formati supportati: PDF, DOCX, DOC, TXT`);
      }

      const formData = new FormData();
      formData.append('document', file);
      
      console.log(`Caricamento file: ${file.name} (${file.size} bytes)`);
      
      const response = await api.post('/transcribe/fromFile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload in corso: ${percentCompleted}%`);
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Errore durante la trascrizione da file:', error);
      
      let errorMessage = 'Errore durante la trascrizione da file';
      
      if (error.response) {
        console.error('Dettagli errore dal server:', error.response.data);
        
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
          
          if (error.response.data.details) {
            errorMessage += `: ${error.response.data.details}`;
          }
        }
        
        if (error.response.status === 400) {
          errorMessage = `Richiesta non valida: ${errorMessage}`;
        } else if (error.response.status === 413) {
          errorMessage = 'Il file è troppo grande. La dimensione massima è 10MB.';
        } else if (error.response.status === 415) {
          errorMessage = 'Formato file non supportato. Formati supportati: PDF, DOCX, DOC, TXT.';
        } else if (error.response.status >= 500) {
          errorMessage = `Errore del server: ${errorMessage}`;
        }
      } else if (error.request) {
        errorMessage = 'Impossibile comunicare con il server. Verifica la tua connessione di rete.';
      }
      
      throw new Error(errorMessage);
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
  },
  
  // Recupera i dati di fatturazione e consumo API
  getBillingData: async () => {
    try {
      const response = await api.get('/billing/costs');
      return response.data;
    } catch (error) {
      console.error('Errore nel recupero dei dati di fatturazione:', error);
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
  analysisService,
  dashboardService
};

export default apiServices; 