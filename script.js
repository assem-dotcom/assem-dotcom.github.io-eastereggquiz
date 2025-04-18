// Game state
const gameState = {
    currentQuestion: 0,
    score: 0,
    totalQuestions: 7,
    isQuizActive: false
};

// Easter quiz questions and answers
const quiz = {
    questions: [
        {
            question: "In Germany, what do children traditionally use to carry their Easter eggs?",
            options: [
                "A wicker basket",
                "Their hats turned upside down",
                "A special wooden box",
                "A decorated wheelbarrow"
            ],
            correct: 1,
            rogerComment: ""
        },
        {
            question: "What was the original color of Easter eggs before artificial dyes?",
            options: [
                "White (natural egg color)",
                "Red (using onion skins)",
                "Yellow (using turmeric)",
                "Green (using spinach)"
            ],
            correct: 1,
            rogerComment: ""
        },
        {
            question: "In which German region did the Easter Bunny tradition originate?",
            options: [
                "Bavaria",
                "Saxony",
                "The Black Forest",
                "The Rhineland"
            ],
            correct: 0,
            rogerComment: ""
        },
        {
            question: "What's the traditional German Easter bread called?",
            options: [
                "Osterbrot",
                "Hefezopf",
                "Stollen",
                "Osterkranz"
            ],
            correct: 1,
            rogerComment: ""
        },
        {
            question: "In medieval Germany, what did people believe about eggs laid on Good Friday?",
            options: [
                "They would never spoil",
                "They would turn into gold",
                "They would hatch dragons",
                "They would cure diseases"
            ],
            correct: 0,
            rogerComment: ""
        },
        {
            question: "What's the traditional German Easter Monday activity?",
            options: [
                "Egg rolling competitions",
                "Water fights between villages",
                "Tree decorating",
                "Bonfire jumping"
            ],
            correct: 1,
            rogerComment: ""
        },
        {
            question: "In some German regions, what do children do with their Easter eggs on Easter Monday?",
            options: [
                "Bury them for good luck",
                "Roll them down hills",
                "Exchange them for chocolate",
                "Use them in egg fights"
            ],
            correct: 3,
            rogerComment: ""
        }
    ]
};

// ASCII art for glitch effects
const asciiArt = [
    `(\\__/)  (\\__/)  (\\__/)
(='.'=)  (='.'=)  (='.'=)
(")_(")  (")_(")  (")_(")`,
    `(>'-')> <('-'<) ^('-')^
(>'-')> <('-'<) ^('-')^`,
    `(\\_/)
(>'.'<)
(")_(")`
];

// Egg colors and states
const eggStates = {
    normal: '#ff69b4',
    cracked: '#808080',
    angry: '#ff4500',
    enlightened: '#39ff14',
    perfect: '#ff69b4'
};

// DOM elements
const clive = document.getElementById('clive');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score-display');
const startBtn = document.getElementById('start-btn');
const glitchOverlay = document.getElementById('glitch-overlay');

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Event Listeners
startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    gameState.isQuizActive = true;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    
    // Show question container
    document.querySelector('.question-container').style.display = 'block';
    
    updateScore();
    startBtn.style.display = 'none';
    showQuestion();
}

function showQuestion() {
    if (!gameState.isQuizActive) return;
    
    const currentQuestion = quiz.questions[gameState.currentQuestion];
    questionText.textContent = currentQuestion.question;
    
    // Clear previous options
    optionsContainer.innerHTML = '';
    
    // Create new options
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option';
        button.textContent = option;
        button.onclick = () => selectAnswer(index);
        optionsContainer.appendChild(button);
    });
    
    // Make options container visible with grid display
    optionsContainer.style.display = 'grid';
    
    // Speak the question
    speak(currentQuestion.question);
}

function selectAnswer(index) {
    if (!gameState.isQuizActive) return;
    
    const currentQuestion = quiz.questions[gameState.currentQuestion];
    const options = document.querySelectorAll('.option');
    const selectedOption = options[index];
    
    // Disable all options
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
    
    // Mark selected option
    selectedOption.classList.add('selected');
    
    const isCorrect = index === currentQuestion.correct;
    
    if (isCorrect) {
        selectedOption.classList.add('correct');
        gameState.score++;
        changeEggState('enlightened');
    } else {
        selectedOption.classList.add('incorrect');
        options[currentQuestion.correct].classList.add('correct');
        changeEggState('cracked');
    }
    
    updateScore();
    
    // Move to next question after delay
    setTimeout(() => {
        gameState.currentQuestion++;
        if (gameState.currentQuestion < gameState.totalQuestions) {
            showQuestion();
        } else {
            showFinalResults();
        }
    }, 2000);
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${gameState.score}/${gameState.totalQuestions}`;
}

function showFinalResults() {
    gameState.isQuizActive = false;
    const percentage = (gameState.score / gameState.totalQuestions) * 100;
    
    questionText.textContent = `Quiz Complete! ${
        percentage === 100 ? "Perfect score! 🌟" :
        percentage >= 70 ? "Great job! 🐰" :
        "Good try! 💝"
    }`;
    
    if (percentage === 100) {
        changeEggState('perfect');
    } else if (percentage >= 70) {
        changeEggState('enlightened');
    } else {
        changeEggState('cracked');
    }
    
    optionsContainer.innerHTML = '';
    
    const restartBtn = document.createElement('button');
    restartBtn.className = 'restart-btn';
    restartBtn.textContent = 'Play Again';
    restartBtn.onclick = () => {
        startBtn.style.display = 'block';
        questionText.textContent = '';
        changeEggState('normal');
    };
    optionsContainer.appendChild(restartBtn);
}

function speak(text) {
    // Check if speech synthesis is supported
    if ('speechSynthesis' in window) {
        // Create a new speech synthesis utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice properties
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to set a female voice if available
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.includes('Female') || 
            voice.name.includes('female') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Google US English Female')
        );
        
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        // Speak the text
        speechSynthesis.speak(utterance);
    }
}

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function triggerGlitch() {
    glitchOverlay.classList.add('glitch-active');
    setTimeout(() => {
        glitchOverlay.classList.remove('glitch-active');
    }, 1000);
}

function changeEggState(state) {
    clive.style.backgroundColor = eggStates[state];
    if (state === 'cracked') {
        clive.classList.add('cracked');
        clive.querySelector('.mouth').style.transform = 'rotate(180deg)';
    } else if (state === 'enlightened') {
        clive.classList.remove('cracked');
        clive.querySelector('.mouth').style.transform = 'rotate(0deg)';
    }
}

function showAsciiArt() {
    const asciiDiv = document.createElement('div');
    asciiDiv.className = 'ascii-art';
    asciiDiv.textContent = getRandomItem(asciiArt);
    document.body.appendChild(asciiDiv);
    setTimeout(() => asciiDiv.remove(), 2000);
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Hide question container and options initially
    document.querySelector('.question-container').style.display = 'none';
    optionsContainer.style.display = 'none';
    
    // Start button click handler
    startBtn.addEventListener('click', startQuiz);
}); 