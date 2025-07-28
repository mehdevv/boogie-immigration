// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcHpigqAvdVJTA3UrKqRVm4wwIt61UFTs",
  authDomain: "bougieimm.firebaseapp.com",
  projectId: "bougieimm",
  storageBucket: "bougieimm.firebasestorage.app",
  messagingSenderId: "978962397992",
  appId: "1:978962397992:web:e1a5a703474172baaa2e1d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore(); 
