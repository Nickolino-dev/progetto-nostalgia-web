import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
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

const pass = prompt("CHIAVE DEL CABINATO:");
if (pass !== "NICO2026") {
  window.location.href = "index.html";
}

// AGGIORNA FOLLOWER
document.getElementById("updateScoreBtn").onclick = async () => {
  const val = document.getElementById("newFollowers").value;
  if (val) {
    await updateDoc(doc(db, "stats", "community"), {
      followers: parseInt(val),
    });
    alert("SCORE AGGIORNATO!");
  }
};

// LISTA PLAYER CON BOTTONI
onSnapshot(
  query(collection(db, "richieste"), orderBy("data", "desc")),
  (snap) => {
    const adminList = document.getElementById("adminList");
    adminList.innerHTML = "";
    snap.forEach((d) => {
      const data = d.data();
      const li = document.createElement("li");
      li.innerHTML = `
            <div style="font-size:0.35rem">P${data.playerPos} <b>${data.utente}</b>: ${data.idea}</div>
            <div class="admin-controls">
                <button onclick="changeStatus('${d.id}', 0)" class="btn-adm wait">W</button>
                <button onclick="changeStatus('${d.id}', 1)" class="btn-adm load">L</button>
                <button onclick="changeStatus('${d.id}', 2)" class="btn-adm online">O</button>
                <button onclick="removeEntry('${d.id}')" class="btn-adm del">X</button>
            </div>
        `;
      adminList.appendChild(li);
    });
  },
);

window.changeStatus = async (id, s) => {
  await updateDoc(doc(db, "richieste", id), { status: s });
};
window.removeEntry = async (id) => {
  if (confirm("ELIMINO?")) await deleteDoc(doc(db, "richieste", id));
};
