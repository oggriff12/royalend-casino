// login.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAVhEyoBPa_PqyhOqm6jn-XF2IeI1oY3vk",
  authDomain: "royalendcasino.firebaseapp.com",
  projectId: "royalendcasino",
  storageBucket: "royalendcasino.firebasestorage.app",
  messagingSenderId: "292123456763",
  appId: "1:292123456763:web:9326eb99056157ed9aac5e",
  measurementId: "G-HWF6L9KTNQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login
document.getElementById("loginBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Logged in!");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};

// Register
document.getElementById("registerBtn").onclick = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Registered & Logged in!");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
};
