// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Track auth state
onAuthStateChanged(auth, user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userInfo = document.getElementById("userInfo");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
    userInfo.textContent = `🎉 Logged in as: ${user.email}`;
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
    userInfo.textContent = "";
  }
});

// Logout function
window.logoutUser = () => {
  signOut(auth).then(() => {
    alert("Logged out!");
  });
};
