// INSERISCI QUI l'URL completo che trovi su RapidAPI nei Code Snippets (JavaScript -> fetch)
const API_URL = "https://...";

// INSERISCI QUI il valore "X-RapidAPI-Host" che trovi sempre nei Code Snippets
const RAPIDAPI_HOST = "...";

async function updateTikTokFollowers(username) {
  try {
    // Configuriamo la richiesta includendo la tua chiave di accesso a RapidAPI
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "fd65a448a9mshd283582ec2b297fp10aeb5jsnb15f6a5f03ab",
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    };

    // Effettua la richiesta all'API
    const response = await fetch(API_URL, options);

    if (!response.ok) {
      throw new Error("Errore di comunicazione con l'API");
    }

    const data = await response.json();

    // NOTA: 'data.followerCount' dipende da come l'API specifica ti restituisce i dati.
    // Dovrai adattare questa variabile alla documentazione dell'API che sceglierai.
    const followers = data.followerCount;

    const scoreElement = document.querySelector(".score-number");
    if (scoreElement && followers !== undefined) {
      // Inserisce il numero nel div, aggiungendo i puntini delle migliaia (es. 1.017)
      scoreElement.textContent = followers.toLocaleString("it-IT");
    }
  } catch (error) {
    console.error("Impossibile caricare i follower di TikTok:", error);
  }
}

// Sostituisci con il tuo vero nome utente (senza la @)
updateTikTokFollowers("tuo_username");
