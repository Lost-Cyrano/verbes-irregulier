// Chargement des données
let verbs = [];
fetch('verbs.txt')
    .then(response => response.text())
    .then(data => {
        verbs = data.split('\n').map(line => {
            const [base, past, pastParticiple, translation] = line.split('|').map(word => word.trim());
            return { base, past, pastParticiple, translation };
        });
        startLearning();
    });

let currentVerb = null;
let progress = 0;
const totalWords = document.getElementById('total-words');
const currentProgress = document.getElementById('current-progress');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');

const levels = {
    0: "base",
    1: "past",
    2: "pastParticiple",
    3: "translation"
};

let cardQueue = [];
let mastery = {}; // Leitner System

function startLearning() {
    verbs.forEach(verb => mastery[verb.base] = 0); // Initialisation du système Leitner
    totalWords.textContent = verbs.length;
    nextQuestion();
}

function nextQuestion() {
    if (cardQueue.length === 0) {
        cardQueue = verbs.slice(); // Recharge toutes les cartes
    }
    currentVerb = cardQueue.shift(); // Sélection de la carte
    const level = mastery[currentVerb.base];
    const questionType = levels[level % 4];
    let questionText = "";

    switch (questionType) {
        case "base":
            questionText = `Donnez le prétérit de "${currentVerb.base}"`;
            break;
        case "past":
            questionText = `Donnez le participe passé de "${currentVerb.past}"`;
            break;
        case "pastParticiple":
            questionText = `Traduisez "${currentVerb.pastParticiple}"`;
            break;
        case "translation":
            questionText = `Quel est la base verbale pour "${currentVerb.translation}" ?`;
            break;
    }
    questionEl.textContent = questionText;
}

document.getElementById('submit').addEventListener('click', () => {
    const userAnswer = answerEl.value.trim().toLowerCase();
    let correctAnswer = "";

    switch (mastery[currentVerb.base] % 4) {
        case 0: correctAnswer = currentVerb.past.toLowerCase(); break;
        case 1: correctAnswer = currentVerb.pastParticiple.toLowerCase(); break;
        case 2: correctAnswer = currentVerb.translation.toLowerCase(); break;
        case 3: correctAnswer = currentVerb.base.toLowerCase(); break;
    }

    if (userAnswer === correctAnswer) {
        feedbackEl.textContent = "Bonne réponse ! 🎉";
        mastery[currentVerb.base]++;
        progress++;
    } else {
        feedbackEl.textContent = `Mauvaise réponse. La bonne réponse était "${correctAnswer}".`;
        cardQueue.push(currentVerb); // Remettre dans la file
    }
    currentProgress.textContent = progress;
    answerEl.value = "";
    nextQuestion();
});
