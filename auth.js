// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Register
window.registerUser = async () => {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registered successfully!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// Login
window.loginUser = async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Logged in!");
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

// Logout
window.logoutUser = () => {
  signOut(auth).then(() => {
    alert("Logged out!");
    window.location.href = "index.html";
  });
};

// Update UI if logged in
onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("userInfo");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (user) {
    userInfo.innerText = `👤 Logged in as ${user.email}`;
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    userInfo.innerText = "";
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }
});
