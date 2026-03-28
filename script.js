import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configurazione Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBBhqe1prV07FnAIcRs_sX3M8ABtx4Gk9E",
  authDomain: "progetto-nostalgia-web.firebaseapp.com",
  projectId: "progetto-nostalgia-web",
  storageBucket: "progetto-nostalgia-web.firebasestorage.app",
  messagingSenderId: "71026677142",
  appId: "1:71026677142:web:001dcf7d5eff5e3b2979b7",
};

// Inizializzazione
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Elementi DOM
const nameField = document.getElementById("userName");
const inputField = document.getElementById("userSuggestion");
const submitBtn = document.getElementById("submitBtn");
const confirmationMsg = document.getElementById("confirmation");

// --- FIX TASTIERA TIKTOK / MOBILE ---
const inputs = [nameField, inputField];
inputs.forEach((input) => {
  input.addEventListener("focus", () => {
    // Aspettiamo che la tastiera si carichi (TikTok è lento)
    setTimeout(() => {
      const yOffset = -100; // Distanza dal bordo superiore
      const y =
        input.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }, 500);
  });
});

// --- INVIO DATI ---
submitBtn.addEventListener("click", async () => {
  const nome = nameField.value.trim();
  const suggestion = inputField.value.trim();

  if (nome !== "" && suggestion !== "") {
    // Stato di caricamento
    submitBtn.innerText = "CARICAMENTO...";
    submitBtn.disabled = true;

    try {
      // Invio a Firestore
      await addDoc(collection(db, "richieste"), {
        utente: nome,
        idea: suggestion,
        tipo: "TikTok Post Idea",
        data: serverTimestamp(),
      });

      // Successo
      nameField.value = "";
      inputField.value = "";
      confirmationMsg.style.display = "block";
      submitBtn.innerText = "INVIA GETTONE";
      submitBtn.disabled = false;

      // Nascondi messaggio dopo 4 secondi
      setTimeout(() => {
        confirmationMsg.style.display = "none";
      }, 4000);
    } catch (e) {
      console.error("Errore database: ", e);
      alert("Errore nel cabinato! Riprova.");
      submitBtn.innerText = "INVIA GETTONE";
      submitBtn.disabled = false;
    }
  } else {
    alert("Socio, inserisci nome e idea per continuare!");
  }
});

import {
  query,
  orderBy,
  limit,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Funzione per mostrare i soci in tempo reale
const sociList = document.getElementById("sociList");
const q = query(collection(db, "richieste"), orderBy("data", "desc"), limit(5));

onSnapshot(q, (snapshot) => {
  sociList.innerHTML = ""; // Pulisce la lista
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    li.textContent = `${data.utente} prenota: ${data.idea}`;
    sociList.appendChild(li);
  });
});
