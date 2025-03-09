# Evolve Navigator

A personal growth tracking application that helps users monitor and visualize their progress across different life areas.

## Features

- **Multi-Area Assessment**: Track progress in various life domains
  - Physical Health & Fitness
  - Mental & Emotional Wellbeing
  - Career & Professional Growth
  - Relationships & Social Life
  - Personal Development
  - Financial Wellness
  - Creativity & Self-Expression
  - Life Purpose & Spirituality

- **Visual Progress Tracking**: 
  - Interactive line charts for each area
  - Trend analysis with percentage changes
  - Color-coded progress indicators
  - Real-time data updates

- **Historical Data**: 
  - Comprehensive assessment history
  - Detailed notes and reflections
  - Date and time tracking
  - Exportable data in JSON format

- **Secure Authentication**: 
  - Google Sign-In integration
  - Protected user data
  - Secure Firestore rules
  - Private assessment storage

- **Responsive Design**: 
  - Mobile-first approach
  - Smooth animations
  - Intuitive navigation
  - Cross-device compatibility

## Tech Stack

- React 18 with TypeScript
- Firebase v9 (Authentication & Firestore)
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for data visualization
- shadcn/ui for UI components
- Vite for development and building
- React Router v6 for navigation

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher) or yarn
- Firebase account and project
- Git
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Code editor (VS Code recommended)
- Terminal/Command Line interface


### Installation

1. Clone the repository:
```bash
git clone https://github.com/Zedef89/evolve-navigator.git
cd evolve-navigator
```

2. Install dependencies:
```bash
npm install
```

## Detailed Setup Guide

### Firebase Setup

1. Create a Firebase Project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add Project"
   - Enter project name like "evolve-navigator"
   - Disable Google Analytics (optional)
   - Click "Create Project"

2. Enable Authentication:
   - In Firebase Console, go to "Build → Authentication"
   - Click "Get Started"
   - In "Sign-in providers" tab, enable "Google"
   - Add your authorized domain (localhost for development)
   - Save the changes

3. Set up Firestore:
   - Go to "Build → Firestore Database"
   - Click "Create Database"
   - Choose "Start in production mode"
   - Select your preferred region
   - Click "Enable"

4. Configure Security Rules:
   - In Firestore, go to "Rules" tab
   - Replace existing rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         match /assessments/{assessmentId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
     }
   }
   ```

5. Get Firebase Configuration:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click the web icon (</>)
   - Register app with nickname or similar "evolve-navigator-web"
   - Copy the firebaseConfig object

6. Set up Environment Variables:
   Create a `.env` file in your project root:
   ```plaintext
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

7. Initialize Firebase in your project:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   ```
   Select:
   - Firestore
   - Choose your project
   - Accept default file locations

## Application Structure

```plaintext
src/
├── components/         # Reusable UI components
├── contexts/          # React contexts (Auth, Assessment)
├── lib/              # Utilities and configurations
├── pages/            # Main application pages
└── styles/           # Global styles and themes
```

## Key Features Documentation

### Authentication
- Google Sign-In authentication
- Protected routes for authenticated users
- Automatic session management

### Assessment System
- Multiple life areas evaluation
- Scoring system (0-10 scale)
- Optional notes for each area
- Progress tracking over time

### Data Visualization
- Interactive line charts for progress tracking
- Individual area trend analysis
- Historical data review

## Development

### Running Locally
```bash
npm run dev
```
Access the application at `http://localhost:8080`

### Building for Production
```bash
npm run build
```

### Testing
```bash
npm run test
```

## Deployment

1. Build the project:
```bash
npm run build
```

2. Deploy to Firebase Hosting (optional):
```bash
firebase deploy
```

## Troubleshooting

### Common Issues

1. Firebase Authentication Issues:
   - Ensure Google Authentication is enabled in Firebase Console
   - Verify environment variables are correctly set
   - Check if Firebase initialization is complete

2. Firestore Access Issues:
   - Verify security rules are properly configured
   - Check user authentication status
   - Ensure correct collection/document path structure

## Contributing

### How to Contribute

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/YourFeatureName
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some feature'
   ```

## License

This project is licensed under the MIT License.

## Support

For issues and feature requests, please use the GitHub Issues section.