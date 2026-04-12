# Colossus2.0_HackHers3

FinGen is a financial literacy education platform with interactive games and AI-powered financial analysis. Players make financial decisions and receive personalized feedback from an AI financial advisor.

## Prerequisites

- **Node.js** v14+ ([Download](https://nodejs.org/))
- **Python** 3.x ([Download](https://python.org/))
- **Git** ([Download](https://git-scm.com/))
- **Groq API Key** SENT CREDS
- **Firebase Project** SENT CREDS

## Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/NehaKudur/FinGen_FSD.git
cd FinGen_FSD
```

### Step 2: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 3: Create `.env` File (Backend Configuration) 

**Manually create the file:**
1. Open `backend/` folder
2. Create a new file named `.env`
3. Paste this content:
```
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Create `firebase.js` File (Frontend Configuration)

Create a new file `frontend/firebase.js`:

CREDENTIALS SENT 


```javascript
// firebase.EXAMPLE.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnop"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

**Replace the values with your Firebase project details.**


### Terminal 1: Start Backend Server (Port 3000)

```bash
cd backend
npm start
```

You should see:
```
Server running on http://localhost:3000
```

### Terminal 2: Start Frontend Server (Port 8000)

Open a **new terminal** and run:

```bash
# Make sure you're in the project root directory
python -m http.server 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000
```

### OPEN IN BROWSER

BASIC INFO:

http://127.0.0.1:3000 - backend
http://localhost:8000 - frontend

Navigate to any of these URLs:
- **Main Site:** http://localhost:8000/
- **Game3 (Recession Run):** http://localhost:8000/frontend/Game3/
- **Game4 (Mahjong):** http://localhost:8000/frontend/Game4_majong/
- **Game5 (Snake):** http://localhost:8000/frontend/Game5_snake/
- **Game6 (UNO):** http://localhost:8000/frontend/Game6_uno/
- **Quiz:** http://localhost:8000/frontend/QuizPage/

## Architecture

### Backend (Node.js Express)
- **Port:** 3000
- **Routes:**
  - `POST /api/analyze-game` - AI financial analysis endpoint
  - Integrates with Groq API for AI responses

### Frontend (Local Server)
- **Port:** 8000
- **Language:** HTML, CSS, JavaScript (ES6 Modules)
- **Features:**
  - Interactive financial games
  - Real-time AI feedback
  - Firebase authentication and database

### API Integration
- **AI Provider:** Groq (llama-3.3-70b-versatile model)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth

## Games Included

| Game | Description | Link |
|------|-------------|------|
| **Game3: Recession Run** | Navigate economic crises with smart financial decisions | `/frontend/Game3/` |
| **Game4: Financial Mahjong** | Match financial concepts and make asset decisions | `/frontend/Game4_majong/` |
| **Game5: Credit Score Snake** | Build credit score through responsible financial choices | `/frontend/Game5_snake/` |
| **Game6: Portfolio Panic** | Manage investment portfolio during market volatility | `/frontend/Game6_uno/` |
| **QuizPage** | Test your financial knowledge | `/frontend/QuizPage/` |

## Features

✅ **AI-Powered Financial Analysis** - Every game generates personalized feedback from the Groq AI  
✅ **Real-time Decision Logging** - Tracks all player choices for analysis  
✅ **Direct Feedback** - AI speaks to players using second-person language ("your choice", "you decided")  
✅ **Multiple Games** - Diverse learning experiences covering savings, investing, credit, and more  
✅ **Secure Configuration** - API keys and credentials are protected (never committed to git)

## Troubleshooting

### Backend won't start
```bash
# Make sure Node.js is installed
node --version

# Make sure dependencies are installed
cd backend
npm install
npm start
```

### Frontend won't load
```bash
# Make sure Python server is running on port 8000
python -m http.server 8000

# If port 8000 is busy, use a different port:
python -m http.server 8080
# Then access: http://localhost:8080/
```

### AI analysis not working
- Check that backend is running on port 3000
- Verify your Groq API key is correct in `backend/.env`
- Check browser console (F12 → Console) for error messages

### Firebase not connecting
- Verify `frontend/firebase.js` has correct config
- Check Firebase Console → Firestore is created
- Verify Authentication is enabled

## File Structure

```
FinGen_FSD/
├── backend/
│   ├── .env (Create this - API keys)
│   ├── server.js (Main backend server)
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── firebase.js (Create this - Firebase config)
│   ├── Game1/
│   ├── Game2/
│   ├── Game3/
│   ├── Game4_majong/
│   ├── Game5_snake/
│   ├── Game6_uno/
│   ├── QuizPage/
│   └── auth/
├── index.html (Main page)
├── styles.css
├── README.md
└── .gitignore
```

## Contributing

Want to contribute? Here's how:
1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Commit and push
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please open a GitHub issue on the [repository](https://github.com/NehaKudur/FinGen_FSD/issues).

---

**Built with ❤️ for financial literacy education**
