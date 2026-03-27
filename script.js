// Importiamo le funzioni necessarie da Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// La tua configurazione (quella che hai appena incollato)
const firebaseConfig = {
  apiKey: "AIzaSyBBhqe1prV07FnAIcRs_sX3M8ABtx4Gk9E",
  authDomain: "progetto-nostalgia-web.firebaseapp.com",
  projectId: "progetto-nostalgia-web",
  storageBucket: "progetto-nostalgia-web.firebasestorage.app",
  messagingSenderId: "71026677142",
  appId: "1:71026677142:web:001dcf7d5eff5e3b2979b7",
};

// Inizializziamo Firebase e il Database Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ... (tieni il codice di inizializzazione Firebase sopra)

const nameField = document.getElementById("userName"); // Nuovo
const inputField = document.getElementById("userSuggestion");
const submitBtn = document.getElementById("submitBtn");
const confirmationMsg = document.getElementById("confirmation");

submitBtn.addEventListener("click", async () => {
  const nome = nameField.value.trim();
  const suggestion = inputField.value.trim();

  if (nome !== "" && suggestion !== "") {
    try {
      await addDoc(collection(db, "richieste"), {
        utente: nome, // Salva il nome
        idea: suggestion, // Salva l'idea anni '90
        data: serverTimestamp(),
      });

      // Feedback e pulizia
      nameField.value = "";
      inputField.value = "";
      confirmationMsg.style.display = "block";

      setTimeout(() => {
        confirmationMsg.style.display = "none";
      }, 3000);
    } catch (e) {
      console.error("Errore: ", e);
      alert("Errore nel cabinato!");
    }
  } else {
    alert("Socio, compila entrambi i campi!");
  }
});
