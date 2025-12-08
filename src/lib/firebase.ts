// Firebase configuration for Grid & Guard
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Firebase configuration using environment variables
// Set these in your .env file (see .env.example)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate required config in development
if (import.meta.env.DEV) {
    const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket'];
    const missingKeys = requiredKeys.filter(
        (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
    );
    if (missingKeys.length > 0) {
        console.warn(
            `⚠️ Missing Firebase config: ${missingKeys.join(', ')}. ` +
            'Copy .env.example to .env and fill in your Firebase credentials.'
        );
    }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;
