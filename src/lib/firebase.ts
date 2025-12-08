// Firebase configuration for Grid & Guard
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCKUp8FzVLO9fFmKK7UW1efFX7kdEq3lWc",
    authDomain: "nimble-climber-454903-d3.firebaseapp.com",
    projectId: "nimble-climber-454903-d3",
    storageBucket: "nimble-climber-454903-d3.firebasestorage.app",
    messagingSenderId: "254266322736",
    appId: "1:254266322736:web:915a0ba2c1e9774aeca2f5",
    measurementId: "G-L8MMXWCMS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Storage
export const storage = getStorage(app);

export default app;
