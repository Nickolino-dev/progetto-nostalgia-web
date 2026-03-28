import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  onSnapshot,
  getCountFromServer,
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
const modal = document.getElementById("sociModal");
const btnModal = document.getElementById("openModal");
const spanClose = document.querySelector(".close-btn");
const sociList = document.getElementById("sociList");

btnModal.onclick = () => (modal.style.display = "block");
spanClose.onclick = () => (modal.style.display = "none");
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
};

const q = query(
  collection(db, "richieste"),
  orderBy("data", "desc"),
  limit(12),
);
onSnapshot(q, (snapshot) => {
  sociList.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const li = document.createElement("li");
    const pNum = data.playerPos
      ? String(data.playerPos).padStart(3, "0")
      : "???";
    li.innerHTML = `<span class="p-num">P${pNum}.</span> <span class="p-nick">${data.utente}</span> - <span class="p-idea">${data.idea}</span>`;
    sociList.appendChild(li);
  });
});

submitBtn.addEventListener("click", async () => {
  const nome = nameField.value.trim().toUpperCase();
  const suggestion = inputField.value.trim().toUpperCase();
  if (nome && suggestion) {
    submitBtn.innerText = "...";
    submitBtn.disabled = true;
    try {
      const snap = await getCountFromServer(collection(db, "richieste"));
      await addDoc(collection(db, "richieste"), {
        utente: nome,
        idea: suggestion,
        playerPos: snap.data().count + 1,
        data: serverTimestamp(),
      });
      nameField.value = "";
      inputField.value = "";
      submitBtn.innerText = "OK!";
      setTimeout(() => {
        submitBtn.innerText = "INVIA GETTONE";
        submitBtn.disabled = false;
      }, 2000);
    } catch (e) {
      alert("ERRORE!");
      submitBtn.disabled = false;
    }
  }
});
