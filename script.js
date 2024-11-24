// Variables globales
let verbs = [];
let currentQuestionIndex = 0;
let correctAnswers = 0;

// Charger les données du fichier verbs.txt
async function loadVerbs() {
    const response = await fetch('verbs.txt');
    const data = await response.text();
    verbs = data.trim().split('\n').map(line => {
        const [base, past, participle, translation] = line.split('|').map(item => item.trim());
        return { base, past, participle, translation };
    });
    startQuiz();
}

// Initialiser le quiz
function startQuiz() {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    document.getElementById('quiz-section').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
    showQuestion();
}

// Afficher une question
function showQuestion() {
    const question = generateQuestion(verbs[currentQuestionIndex]);
    document.getElementById('question').innerText = question.text;

    const quizOptions = document.getElementById('quiz-options');
    quizOptions.innerHTML = '';

    question.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.onclick = () => checkAnswer(option.correct);
        quizOptions.appendChild(button);
    });

    document.getElementById('next-btn').disabled = true;
}

// Générer une question avec options
function generateQuestion(verb) {
    const randomType = Math.floor(Math.random() * 3);
    const options = [];
    let questionText = '';

    switch (randomType) {
        case 0: // Question sur le prétérit
            questionText = `Quel est le prétérit du verbe "${verb.base}" ?`;
            options.push(...generateOptions(verb.past, 'past'));
            break;
        case 1: // Question sur le participe passé
            questionText = `Quel est le participe passé du verbe "${verb.base}" ?`;
            options.push(...generateOptions(verb.participle, 'participle'));
            break;
        case 2: // Question sur la traduction
            questionText = `Quelle est la traduction de "${verb.base}" ?`;
            options.push(...generateOptions(verb.translation, 'translation'));
            break;
    }

    return { text: questionText, options };
}

// Générer les options pour une question
function generateOptions(correctAnswer, type) {
    const options = [];
    options.push({ text: correctAnswer, correct: true });

    while (options.length < 4) {
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const wrongAnswer = randomVerb[type];

        if (!options.some(option => option.text === wrongAnswer)) {
            options.push({ text: wrongAnswer, correct: false });
        }
    }

    return options.sort(() => Math.random() - 0.5);
}

// Vérifier la réponse
function checkAnswer(correct) {
    if (correct) {
        correctAnswers++;
    }
    document.getElementById('next-btn').disabled = false;
}

// Passer à la question suivante
document.getElementById('next-btn').onclick = () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < verbs.length) {
        showQuestion();
    } else {
        endQuiz();
    }
};

// Fin du quiz
function endQuiz() {
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
    document.getElementById('score').innerText = `Vous avez eu ${correctAnswers} réponses correctes sur ${verbs.length}.`;
}

// Redémarrer le quiz
function restartQuiz() {
    startQuiz();
}

// Charger les verbes au démarrage
loadVerbs();
