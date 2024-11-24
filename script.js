// script.js
document.addEventListener("DOMContentLoaded", () => {
    const verbes = [
        { present: "be", preterit: "was/were", participe: "been" },
        { present: "go", preterit: "went", participe: "gone" },
        { present: "cut", preterit: "cut", participe: "cut" }
    ];

    const listeVerbes = document.getElementById("verbes");
    const recherche = document.getElementById("recherche");

    const afficherVerbes = (filtre = "") => {
        listeVerbes.innerHTML = verbes
            .filter(verbe => verbe.present.includes(filtre))
            .map(verbe => `
                <li>${verbe.present} - ${verbe.preterit} - ${verbe.participe}</li>
            `).join("");
    };

    recherche.addEventListener("input", () => {
        afficherVerbes(recherche.value);
    });

    afficherVerbes();
});

function lancerQuiz() {
    const quizContent = document.getElementById("quiz-content");
    quizContent.innerHTML = "<p>Exemple de quiz en cours de développement...</p>";
}
