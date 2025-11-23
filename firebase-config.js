// Configuración de Firebase
// Reemplaza estos valores con los de tu proyecto Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAyT2h6W3oPUok2vh9SQnwyLP-wXW6aHjc",
    authDomain: "db-restaurant-78e90.firebaseapp.com",
    projectId: "db-restaurant-78e90",
    storageBucket: "db-restaurant-78e90.firebasestorage.app",
    messagingSenderId: "756893053914",
    appId: "1:756893053914:web:0f8927c012043f1bc7c6e3"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

// Exportar para uso en otros archivos
window.db = db;
