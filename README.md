# Language Learning App

A mobile-optimized Progressive Web App (PWA) for language learning through reading. Upload PDFs or select from a library, and use AI-powered translations with structure-preserving features to learn languages naturally.

![Language Learning App](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-cyan)

## ✨ Features

### 📱 Touch Gestures
- **Tap & Hold**: Simplify text by 1 CEFR level (e.g., B2 → B1)
- **Double-Tap & Hold**: Simplify text by 2 CEFR levels (e.g., B2 → A2)
- **Tap on Word**: Translate word to native language (popup)
- **Swipe Right**: Next page
- **Swipe Left**: Previous page

### 🎯 CEFR-Based Learning
- Six proficiency levels: A1, A2, B1, B2, C1, C2
- Dynamic text simplification
- Adaptive difficulty adjustment

### 🤖 AI-Powered Translation
- Google Gemini API integration
- Structure-preserving translations
- Maintains sentence structure for better learning
- Word-for-word mapping capability

### 💾 Smart Caching
- Pre-loading of next 2 pages
- Firestore storage for translated pages
- Avoids duplicate API calls

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React + Vite (PWA) |
| **Styling** | Tailwind CSS (mobile-first) |
| **AI API** | Google Gemini |
| **Auth** | Firebase Authentication |
| **Database** | Firebase Firestore |
| **Routing** | React Router |
| **Hosting** | GitHub Pages (main branch) |

## 📁 Project Structure

```
language-learning-app/
├── public/
│   └── icons/              # PWA app icons
├── src/
│   ├── components/
│   │   ├── Reader/         # Main reading area
│   │   │   ├── PageView.jsx
│   │   │   ├── WordPopup.jsx
│   │   │   └── LevelIndicator.jsx
│   │   ├── Library/        # Text selection & upload
│   │   │   ├── TextLibrary.jsx
│   │   │   └── PdfUpload.jsx
│   │   ├── Onboarding/     # Onboarding flow
│   │   │   ├── Welcome.jsx
│   │   │   ├── LanguageSelect.jsx
│   │   │   └── LevelAssessment.jsx
│   │   ├── Auth/           # Authentication
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── AuthGuard.jsx
│   │   └── UI/             # Reusable components
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       └── Loading.jsx
│   ├── hooks/
│   │   ├── useGestures.js      # Touch gesture handler
│   │   ├── useTranslation.js   # Gemini API integration
│   │   ├── useAuth.js          # Firebase Auth
│   │   └── useFirestore.js     # Firestore operations
│   ├── services/
│   │   ├── firebase.js         # Firebase config
│   │   ├── gemini.js           # Gemini API service
│   │   └── pdfParser.js        # PDF to text conversion
│   ├── context/
│   │   ├── AuthContext.jsx     # Auth state
│   │   └── ReaderContext.jsx   # Reader state
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Reader.jsx          # Main reader view
│   │   ├── Library.jsx         # Text library
│   │   ├── Profile.jsx         # User profile
│   │   └── Onboarding.jsx      # Onboarding wrapper
│   ├── utils/
│   │   ├── cefrLevels.js       # CEFR level utilities
│   │   └── textProcessing.js   # Text pagination
│   ├── App.jsx                 # Main app with routing
│   └── main.jsx                # Entry point
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages deployment
├── .env.example                # Environment variables template
├── vite.config.js              # Vite + PWA config
├── tailwind.config.js          # Tailwind config
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project ([Create one](https://console.firebase.google.com/))
- Google Gemini API key ([Get one](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/noahkoldow/language-learning-app.git
   cd language-learning-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```
   
   Open [http://localhost:5173](http://localhost:5173) in your browser.

5. **Build for production**
   ```bash
   npm run build
   ```

## 🔥 Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - (Optional) Enable Google Sign-in
3. Create a Firestore Database:
   - Go to Firestore Database
   - Create database in production or test mode
   - Set up security rules as needed
4. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the config values to your `.env` file

### Firestore Structure

```
users/
  {userId}/
    profile: { nativeLanguage, targetLanguage, currentLevel }
    texts/
      {textId}/
        metadata: { title, originalLanguage, pageCount }
        pages/
          {pageNumber}/
            original: "..."
            translations/
              {language}_{level}: "..."
```

## 🤖 Gemini API Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create or sign in to your Google account
3. Generate an API key
4. Add the key to your `.env` file as `VITE_GEMINI_API_KEY`

## 📦 Deployment

### GitHub Pages (Automatic)

This project is configured to automatically deploy to GitHub Pages on every push to the `main` branch.

1. **Set up secrets** in your GitHub repository:
   - Go to Settings > Secrets and variables > Actions
   - Add the following secrets:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_GEMINI_API_KEY`

2. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Source: GitHub Actions

3. **Push to main branch**:
   ```bash
   git push origin main
   ```

The app will be automatically built and deployed to `https://<username>.github.io/language-learning-app/`

## 🎨 Customization

### Tailwind Configuration

Modify `tailwind.config.js` to customize colors, spacing, and other design tokens.

### CEFR Levels

Edit `src/utils/cefrLevels.js` to adjust level definitions or add custom levels.

### Sample Texts

Add or modify sample texts in `src/components/Library/TextLibrary.jsx`.

## 📱 PWA Features

- **Offline Support**: Service worker caches assets for offline use
- **Install Prompt**: Users can install the app on their device
- **Mobile Optimized**: Designed for mobile-first experience
- **Touch Gestures**: Natural gesture-based interaction

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Structure

- **Components**: Reusable UI components following atomic design
- **Hooks**: Custom hooks for business logic
- **Context**: Global state management
- **Services**: External API integrations
- **Utils**: Helper functions and utilities

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI framework
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Firebase](https://firebase.google.com/) - Backend services
- [Google Gemini](https://ai.google.dev/) - AI translation
- [PDF.js](https://mozilla.github.io/pdf.js/) - PDF parsing

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Made with ❤️ for language learners worldwide
