// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkPf_BSkb1VXSd9HNvzHKcWCPcS-Ghrr4",
  authDomain: "multicampus-a8845.firebaseapp.com",
  projectId: "multicampus-a8845",
  storageBucket: "multicampus-a8845.firebasestorage.app",
  messagingSenderId: "1009869895808",
  appId: "1:1009869895808:web:9c90cab803825b6ac74e65"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore(); 