import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBhqe1prV07FnAIcRs_sX3M8ABtx4Gk9E",
  authDomain: "progetto-nostalgia-web.firebaseapp.com",
  projectId: "progetto-nostalgia-web",
  storageBucket: "progetto-nostalgia-web.firebasestorage.app",
  messagingSenderId: "71026677142",
  appId: "1:71026677142:web:001dcf7d5eff5e3b2979b7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const nameField = document.getElementById("userName");
const inputField = document.getElementById("userSuggestion");
const submitBtn = document.getElementById("submitBtn");
const confirmationMsg = document.getElementById("confirmation");

// FIX TASTIERA MOBILE: Scrolla l'input al centro quando cliccato
const inputs = [nameField, inputField];
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    setTimeout(() => {
      input.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  });
});

// INVIO DATI A FIREBASE
submitBtn.addEventListener("click", async () => {
  const nome = nameField.value.trim();
  const suggestion = inputField.value.trim();

  if (nome !== "" && suggestion !== "") {
    submitBtn.innerText = "INVIO...";
    submitBtn.disabled = true;

    try {
      await addDoc(collection(db, "richieste"), {
        utente: nome,
        idea: suggestion,
        tipo: "TikTok Idea Anni 90",
        data: serverTimestamp(),
      });

      nameField.value = "";
      inputField.value = "";
      confirmationMsg.style.display = "block";
      submitBtn.innerText = "INVIA GETTONE";
      submitBtn.disabled = false;

      setTimeout(() => {
        confirmationMsg.style.display = "none";
      }, 4000);
    } catch (e) {
      console.error("Errore: ", e);
      alert("Errore nel cabinato! Riprova.");
      submitBtn.disabled = false;
    }
  } else {
    alert("Socio, inserisci nome e idea!");
  }
});
