
const questions = [
    {
        question: "What is 2 + 2?",
        type: "multiple-choice",
        options: ["3", "4", "5", "6"],
        answer: "4",
        points: 5
    },
    {
        question: "What is the capital of France?",
        type: "text",
        answer: "Paris",
        points: 5
    }
];

let currentQuestionIndex = 0;
let totalPoints = 0;
let answers = [];

const totalTime = 3 * 60;
let timeRemaining = totalTime;
let timerInterval;

document.addEventListener('DOMContentLoaded', (event) => {
    const name = localStorage.getItem('name');
    const nim = localStorage.getItem('nim');

    if (name && nim) {
        document.getElementById('userData').textContent = `Nama: ${name} | NIM: ${nim}`;
    } else {
        document.getElementById('userData').textContent = 'Data tidak tersedia.';
    }

    if (document.getElementById('question-container')) {
        renderQuestion();
    } else {
        displayResults();
    }
});

function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeRemaining--;

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerElement.textContent = `Time Left: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            endQuiz();
        }

        localStorage.setItem('timeRemaining', timeRemaining); 
    }, 1000);
}
function loadTimer() {
    if (localStorage.getItem('timeRemaining')) {
        timeRemaining = parseInt(localStorage.getItem('timeRemaining'));
    }
    startTimer();
}

function startQuiz() {
    location.href = 'quiz.html';
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        endQuiz();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function renderQuestion() {
    const questionContainer = document.getElementById('question-container');
    const questionData = questions[currentQuestionIndex];
    
    questionContainer.innerHTML = `
        <h2>${questionData.question}</h2>
    `;
    
    if (questionData.type === "multiple-choice") {
        questionData.options.forEach((option) => {
            questionContainer.innerHTML += `
                <button onclick="selectAnswer('${option}')">${option}</button>
            `;
        });
    } else if (questionData.type === "text") {
        questionContainer.innerHTML += `
            <input type="text" id="text-answer" placeholder="Your answer here">
            <button onclick="submitAnswer()">Submit</button>
        `;
    }

    questionContainer.innerHTML += `
        <div class="navigation-buttons">
            <button onclick="prevQuestion()" id="prev-btn" ${currentQuestionIndex === 0 ? 'disabled' : ''}>Previous</button>
            <button onclick="${currentQuestionIndex === questions.length - 1 ? 'endQuiz()' : 'nextQuestion()'}" id="next-btn">
                ${currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
            </button>
        </div>
    `;

    updateQuestionStatus();
}

function selectAnswer(answer) {
    checkAnswer(answer);
    nextQuestion();
}

function submitAnswer() {
    const answer = document.getElementById('text-answer').value;
    checkAnswer(answer);
    nextQuestion();
}

function checkAnswer(answer) {
    const questionData = questions[currentQuestionIndex];
    const isCorrect = answer === questionData.answer;

    answers.push({
        question: questionData.question,
        selectedAnswer: answer,
        correctAnswer: questionData.answer,
        correct: isCorrect
    });

    if (isCorrect) {
        totalPoints += questionData.points;
    }
}

function updateQuestionStatus() {
    const statusElement = document.getElementById('question-status');
    statusElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

function endQuiz() {
    clearInterval(timerInterval);
    localStorage.setItem('totalPoints', totalPoints);
    localStorage.setItem('answers', JSON.stringify(answers));
    location.href = 'result.html';
}

window.onload = function () {
    if (location.pathname.includes("quiz.html")) {
        renderQuestion();
        loadTimer();  
    } else if (location.pathname.includes("result.html")) {
        displayResults();
    }
}


function displayResults() {
    const resultContainer = document.getElementById('result-container');
    const totalPoints = localStorage.getItem('totalPoints');
    const answers = JSON.parse(localStorage.getItem('answers'));

    const questionsSummary = questions.map((question, index) => {
        const answer = answers.find(a => a.question === question.question);
        const selectedAnswer = answer ? answer.selectedAnswer : "";
        const correctAnswer = question.answer;
        return `
            <div class="result-item">
                <p><strong>Question ${index + 1}:</strong> ${question.question}</p>
                <p>Your Answer: ${selectedAnswer}</p>
                <p>Correct Answer: ${correctAnswer}</p>
                <p>${selectedAnswer === correctAnswer ? "Correct" : "Incorrect"}</p>
            </div>
            <hr>
        `;
    }).join('');

    resultContainer.innerHTML = `<p>Total Points: ${totalPoints}</p>${questionsSummary}`;
}

document.getElementById('playerForm').onsubmit = function(e) {
    e.preventDefault();
    localStorage.setItem('name', document.getElementById('name').value);
    localStorage.setItem('nim', document.getElementById('nim').value);
    window.location.href = 'quiz.html';
}
function toggleNavbar() {
    const navbarToggler = document.getElementById("navbarToggler");
    navbarToggler.style.display = navbarToggler.style.display === "flex" ? "none" : "flex";
}
