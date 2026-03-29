import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
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

// ELEMENTI DOM
const scoreDisplay = document.querySelector(".score-number");
const nickInput = document.getElementById("nickname");
const ideaInput = document.getElementById("idea");
const submitBtn = document.getElementById("submitBtn");
const sociList = document.getElementById("sociList");
const homeFeed = document.getElementById("homeFeed");
const hallModal = document.getElementById("hallModal");
const hallBtn = document.getElementById("hallOfFameBtn");
const closeBtn = document.querySelector(".close-modal");
const hallBadge = document.getElementById("hallBadge");

// 1. LEGGI FOLLOWER IN TEMPO REALE
onSnapshot(doc(db, "stats", "community"), (doc) => {
  if (doc.exists()) scoreDisplay.innerText = doc.data().followers;
});

// 2. INVIA GETTONE
submitBtn.addEventListener("click", async () => {
  const utente = nickInput.value.trim();
  const idea = ideaInput.value.trim();

  if (utente && idea) {
    submitBtn.disabled = true;
    submitBtn.innerText = "INVIO...";

    const snapshot = await getCountFromServer(collection(db, "richieste"));
    const nextPos = snapshot.data().count + 1;

    await addDoc(collection(db, "richieste"), {
      utente,
      idea,
      playerPos: nextPos,
      status: 0,
      data: Date.now(),
    });

    nickInput.value = "";
    ideaInput.value = "";
    submitBtn.disabled = false;
    submitBtn.innerText = "INVIA GETTONE";
    alert("GETTONE INSERITO! 🎮");
  } else {
    alert("INSERISCI NICK E IDEA!");
  }
});

// 3. LEGGI RICHIESTE (Hall of Fame + Home Feed)
const q = query(collection(db, "richieste"), orderBy("data", "desc"));
onSnapshot(q, (snapshot) => {
  if (!snapshot.empty) hallBadge.style.display = "block";
  sociList.innerHTML = "";
  homeFeed.innerHTML = "";

  snapshot.forEach((docSnap, index) => {
    const data = docSnap.data();
    const li = document.createElement("li");
    const pNum = data.playerPos
      ? String(data.playerPos).padStart(3, "0")
      : "???";

    let sText = "[W]",
      sClass = "status-0";
    if (data.status === 1) {
      sText = "[L]";
      sClass = "status-1";
    } else if (data.status === 2) {
      sText = "[O]";
      sClass = "status-2";
    }

    const content = `<div><span class="p-num">P${pNum}</span> <b>${data.utente}</b>: ${data.idea}</div> <span class="status-tag ${sClass}">${sText}</span>`;
    li.innerHTML = content;

    sociList.appendChild(li); // Hall of Fame
    if (index < 5) homeFeed.appendChild(li.cloneNode(true)); // Home Feed (ultimi 5)
  });
});

// MODALE LOGICA
hallBtn.onclick = () => {
  hallModal.style.display = "block";
  hallBadge.style.display = "none";
};
closeBtn.onclick = () => (hallModal.style.display = "none");
window.onclick = (e) => {
  if (e.target == hallModal) hallModal.style.display = "none";
};
