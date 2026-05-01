const FORMSPREE_URL = "https://formspree.io/f/mvzlpjlr";
const motsTexteur = [
    "DOCUMENT", "PAGE", "MARGE", "PIED", "ENTETE", 
    "GRAS", "ITALIQUE", "ORIENTATION", "INSERTION", "CENTRER", 
    "TABLEAU", "PAYSAGE", "PORTRAIT", "SAISIR", "PARAGRAPHE"
];

// Simulation base de données élève
const eleves = [
  { massar: "D180028436", nom: "LAKHLIFI AHMED KHALIL", date: "29/10/2012" },
  { massar: "D184134212", nom: "BENSEGHIR AICHA", date: "20/08/2013" },
  { massar: "F172027558", nom: "NASSIRI HAMZA", date: "01/06/2013" },
  { massar: "F173170846", nom: "FLIMINE JIHANE", date: "25/09/2012" },
  { massar: "F176215999", nom: "DAIOUF SAID", date: "03/04/2013" },
  { massar: "F176222992", nom: "FARIK OMAR", date: "15/06/2013" },
  { massar: "F178200175", nom: "KARIMI Rania", date: "05/08/2013" },
  { massar: "F180125390", nom: "ABOULKACEM YOUSSEF", date: "12/01/2013" },
  { massar: "F181004108", nom: "BELAHMER Mamoune", date: "17/04/2013" },
  { massar: "F181088356", nom: "JAWADI MERYEM", date: "26/12/2012" },
  { massar: "F182136547", nom: "boualam rayane", date: "24/02/2012" },
  { massar: "F184141108", nom: "ESSABAB RANIA", date: "14/11/2013" },
  { massar: "F185146897", nom: "BOUZELGHA ACHRAF", date: "07/08/2012" },
  { massar: "F206003964", nom: "ANWAR MALAK", date: "25/06/2013" },
  { massar: "F190146438", nom: "EL AOUFI MOHAMED RAYA", date: "20/05/2013" },
  { massar: "F192112151", nom: "L'HARRAS CHARKI", date: "20/06/2013" },
  { massar: "F196081647", nom: "LAAROUSSI JAYDAE", date: "20/08/2013" },
  { massar: "F196135859", nom: "TAMIMI MOHAMMED ALI", date: "09/09/2013" },
  { massar: "F197081485", nom: "CHHIHAB FATINE", date: "22/07/2013" },
  { massar: "F199081532", nom: "EL HAYAN MERIEM", date: "15/08/2013" },
  { massar: "F199166256", nom: "ERWADI ILYAS", date: "10/02/2014" },
  { massar: "F199187902", nom: "JABIRY CHAHD", date: "04/11/2013" },
  { massar: "F199193309", nom: "AYOUT ZINEB", date: "17/10/2012" },
  { massar: "G197074506", nom: "MORABIT HAJAR", date: "13/02/2013" },
  { massar: "F181173584", nom: "HADRI ADAM", date: "23/03/2013" },
  { massar: "F181205768", nom: "MAZOU Walid", date: "18/08/2012" },
  { massar: "F186060427", nom: "OUTTALIBI AYOUB", date: "01/01/2013" },
  { massar: "F184178628", nom: "BOURAADA ILYAS", date: "13/06/2013" },
  { massar: "F165012130", nom: "EL MOUHILI AMINE", date: "15/04/2010" },
  { massar: "F199033664", nom: "AITLAABAR IMRANE", date: "05/08/2013" },
  { massar: "C191138785", nom: "QASSIMI IBRAHIM", date: "27/06/2013" },
  { massar: "F188177286", nom: "MAKTAN ABDELALI", date: "04/11/2013" },
  { massar: "F195028405", nom: "JINAH IMRANE", date: "03/04/2013" },
  { massar: "F197046555", nom: "EL FAKIR SAAD", date: "30/07/2013" },
  { massar: "F198215979", nom: "SAEED Saqer Ahmed", date: "18/08/2012" }
];

let currentUser = null;
let wordsStatus = {}; 
let gridData = Array(15).fill().map(() => Array(15).fill(null));

// 1. Authentification
function authentifier() {
    const code = document.getElementById('massar-in').value.trim().toUpperCase();
    currentUser = eleves.find(e => e.massar === code);
    if (currentUser) {
        document.getElementById('login-overlay').style.display = 'none';
        document.getElementById('game-app').style.display = 'flex';
        initJeu();
    } else {
        alert("Identifiant non reconnu.");
    }
}

// 2. Préparation de l'atelier
function initJeu() {
    const container = document.getElementById('anagram-container');
    motsTexteur.forEach(word => {
        wordsStatus[word] = { unlocked: false, found: false };
        const div = document.createElement('div');
        div.className = 'anagram-item';
        
        // Mélange des lettres
        const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
        
        div.innerHTML = `
            <span class="scrambled">Lettres : ${scrambled}</span>
            <input type="text" class="word-input" id="input-${word}" 
                   placeholder="Devine le mot..." oninput="verifierAtelier('${word}')">
        `;
        container.appendChild(div);
    });
    placerMots();
    dessinerGrille();
}

// 3. Validation de l'anagramme
function verifierAtelier(original) {
    const input = document.getElementById(`input-${original}`);
    if (input.value.toUpperCase() === (original === "ENTETE" ? "EN-TÊTE" : original).replace("-", "").replace("Ê", "E")) {
        // Note : On simplifie la saisie pour l'élève (sans accent)
    }
    // Version simplifiée pour la comparaison directe :
    if (input.value.toUpperCase() === original) {
        input.disabled = true;
        input.style.borderColor = "var(--success)";
        wordsStatus[original].unlocked = true;
    }
}

// 4. Algorithme de placement avec ID UNIQUE (Anti-bug doublons)
function placerMots() {
    motsTexteur.forEach((word, idx) => {
        let placed = false;
        while (!placed) {
            let horizontal = Math.random() > 0.5;
            let r = Math.floor(Math.random() * (horizontal ? 15 : 15 - word.length));
            let c = Math.floor(Math.random() * (horizontal ? 15 - word.length : 15));
            
            let possible = true;
            for(let i=0; i<word.length; i++) {
                if (gridData[horizontal ? r : r+i][horizontal ? c+i : c]) {
                    possible = false; break;
                }
            }
            
            if (possible) {
                for(let i=0; i<word.length; i++) {
                    gridData[horizontal ? r : r+i][horizontal ? c+i : c] = { 
                        char: word[i], wordName: word, wordId: idx 
                    };
                }
                placed = true;
            }
        }
    });
}

// 5. Rendu de la grille
function dessinerGrille() {
    const container = document.getElementById('grid-container');
    container.innerHTML = "";
    for (let r = 0; r < 15; r++) {
        for (let c = 0; c < 15; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const data = gridData[r][c];
            cell.textContent = data ? data.char : String.fromCharCode(65 + Math.floor(Math.random() * 26));
            if (data) cell.setAttribute('data-id', data.wordId);
            cell.onclick = () => cliquerCellule(cell, r, c);
            container.appendChild(cell);
        }
    }
}

// 6. Gestion du clic
function cliquerCellule(cell, r, c) {
    const data = gridData[r][c];
    if (!data || !wordsStatus[data.wordName].unlocked) return;

    cell.classList.add('selected');
    const id = data.wordId;
    const wordCells = document.querySelectorAll(`.cell[data-id="${id}"]`);
    const selectedCells = document.querySelectorAll(`.cell[data-id="${id}"].selected`);

    if (wordCells.length === selectedCells.length) {
        wordCells.forEach(el => {
            el.classList.remove('selected');
            el.classList.add('found');
        });
        wordsStatus[data.wordName].found = true;
        verifierFin();
    }
}

function verifierFin() {
    if (motsTexteur.every(w => wordsStatus[w].found)) {
        setTimeout(() => document.getElementById('feedback-overlay').style.display = 'flex', 600);
    }
}

// 7. Envoi Formspree
async function envoyerDonnees() {
    const feedback = document.getElementById('user-feedback').value;
    if (feedback.trim().length < 10) return alert("Décris un peu plus tes compétences !");
    
    const btn = document.getElementById('submit-btn');
    btn.disabled = true;
    btn.textContent = "Envoi...";

    try {
        const response = await fetch(FORMSPREE_URL, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                eleve: currentUser.nom,
                bilan: feedback,
                sujet: "Traitement de texte"
            })
        });
        if (response.ok) {
            alert("Bilan envoyé ! Bravo.");
            location.reload();
        }
    } catch (e) {
        btn.disabled = false;
        alert("Erreur de connexion.");
    }
}
