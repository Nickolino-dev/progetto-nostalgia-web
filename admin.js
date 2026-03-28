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

// PROTEZIONE SEMPLICE
const pass = prompt("INSERISCI CHIAVE DEL CABINATO:");
if (pass !== "NICO2026") {
  // <--- CAMBIA QUESTA CON LA TUA PASSWORD
  alert("ACCESSO NEGATO!");
  window.location.href = "index.html";
}

const adminList = document.getElementById("adminList");

// Carica la lista con i bottoni
onSnapshot(
  query(collection(db, "richieste"), orderBy("data", "desc")),
  (snapshot) => {
    adminList.innerHTML = "";
    snapshot.forEach((documento) => {
      const data = documento.data();
      const id = documento.id;
      const li = document.createElement("li");
      li.style.whiteSpace = "normal"; // Permette di vedere i bottoni

      li.innerHTML = `
            <div style="margin-bottom: 10px;">
                <span class="p-num">P${data.playerPos}</span> <b>${data.utente}</b>: ${data.idea}
            </div>
            <div class="admin-controls">
                <button class="btn-adm wait" onclick="changeStatus('${id}', 0)">W</button>
                <button class="btn-adm load" onclick="changeStatus('${id}', 1)">L</button>
                <button class="btn-adm online" onclick="changeStatus('${id}', 2)">O</button>
                <button class="btn-adm del" onclick="removeEntry('${id}')">X</button>
            </div>
        `;
      adminList.appendChild(li);
    });
  },
);

// Funzioni globali per i bottoni
window.changeStatus = async (id, newStatus) => {
  const docRef = doc(db, "richieste", id);
  await updateDoc(docRef, { status: newStatus });
};

window.removeEntry = async (id) => {
  if (confirm("ELIMINARE PLAYER?")) {
    await deleteDoc(doc(db, "richieste", id));
  }
};
