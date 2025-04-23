# EchoLog

EchoLog è una web application avanzata per la registrazione, trascrizione e analisi di contenuti audio e testuali, progettata per aumentare l'efficienza e la produttività nella gestione delle informazioni vocali.

![EchoLog Logo](frontend/src/EchoLog%20Logo1.png)

## Caratteristiche Principali

### 🎙️ Registrazione Audio
- Registrazione istantanea direttamente dal browser
- Supporto per upload di file audio pre-registrati
- Interfaccia intuitiva e reattiva

### 📝 Trascrizione Avanzata
- Trascrizione automatica mediante Google Cloud Speech
    (Possibile sviluppo per elaborazione parallela per risultati rapidi)
- Supporto multilingua

### 🧠 Analisi dei Contenuti
- Analisi semantica del testo
- Identificazione di parole chiave e argomenti principali
- Estrazione di insights e statistiche

### 📊 Dashboard e Reportistica
- Visualizzazione grafica dei dati
- Monitoraggio dell'utilizzo e dei consumi
- Esportazione in PDF dei risultati

### 📄 Text Analyzer
- Analisi diretta di contenuti testuali
- Supporto per file di testo, PDF e documenti Word
- Generazione di report dettagliati

## Tecnologie Utilizzate

### Frontend
- React 19
- Material-UI 7
- React Router Dom
- Recharts per visualizzazioni grafiche
- Autenticazione Google OAuth

### Backend
- Node.js con Express
- MongoDB per la persistenza dei dati
- Google Cloud (Speech-to-Text, Storage, VertexAI)
- FFmpeg per l'elaborazione audio

## Come Iniziare

1. Accedi all'applicazione tramite il link sotto
2. Effettua l'autenticazione con il tuo account Google
3. Dalla dashboard, scegli l'operazione da effettuare:
   - Registra un nuovo audio
   - Analizza un testo
   - Visualizza la cronologia delle registrazioni
   - Monitora i consumi

## Accesso all'Applicazione

[Visita EchoLog](https://echolog-frontend-theta.vercel.app)

## Video Dimostrativo

[Guarda la Demo su YouTube](https://youtu.be/Ww7Vge9-iRw)

---

© 2024 EchoLog. Tutti i diritti riservati. 