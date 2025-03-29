import axios from 'axios';

const API_URL = 'http://localhost:5050/api';

const authService = {
    // Login con Google
    async loginWithGoogle(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/google`, userData);
            if (response.data.token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || 'Errore durante il login';
        }
    },

    // Verifica token
    async verifyToken() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user?.token) {
                throw new Error('Token non trovato');
            }

            const response = await axios.get(`${API_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            return response.data;
        } catch (error) {
            this.logout();
            throw error.response?.data?.error || 'Sessione scaduta';
        }
    },

    // Logout
    logout() {
        localStorage.removeItem('user');
    },

    // Recupera utente corrente
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    },

    // Setup interceptor per aggiungere il token alle richieste
    setupAxiosInterceptors() {
        axios.interceptors.request.use(
            (config) => {
                const user = this.getCurrentUser();
                if (user?.token) {
                    config.headers.Authorization = `Bearer ${user.token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.logout();
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }
};

export default authService; 