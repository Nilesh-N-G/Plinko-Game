
// firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCsb7zLUXOKcsPTfeJXJ7hvj0nAWBWu2qc",
    authDomain: "plinkogame-3471c.firebaseapp.com",
    projectId: "plinkogame-3471c",
    storageBucket: "plinkogame-3471c.firebasestorage.app",
    messagingSenderId: "319703684209",
    appId: "1:319703684209:web:1384d69779401d665837d0",
    measurementId: "G-Y8NMFZY27N"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Auth instance
const auth = getAuth(app);

export { auth };

