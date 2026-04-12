# Colossus2.0_HackHers3

## Setup Instructions

### Prerequisites
- Node.js (for backend)
- Python 3.x (for local server)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NehaKudur/FinGen_FSD.git
   cd FinGen_FSD
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Variables:**
   Create a `.env` file in the `backend/` directory:
   ```
   GROQ_API_KEY=your-groq-api-key-here
   ```
   Get your API key from [Groq Console](https://console.groq.com/)

4. **Firebase Setup:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore Database
   - Create `frontend/firebase.js` with your Firebase config:
   ```javascript
   import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
   import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
   import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "123456789",
     appId: "your-app-id"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

### Running the Application

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   python -m http.server 8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000`

### Games Included
- Game1: [Description]
- Game2: [Description]
- Game3: Recession Run
- Game4: Financial Mahjong
- Game5: Credit Score Snake
- Game6: Portfolio Panic
- QuizPage: Financial Quiz

All games feature AI-powered financial analysis and feedback.
