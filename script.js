// Game state
const gameState = {
    currentQuestion: 0,
    score: 0,
    totalQuestions: 7,
    isQuizActive: false,
    currentDecorations: []
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
const questionContainer = document.querySelector('.question-container');
const glitchOverlay = document.getElementById('glitch-overlay');
const decorationInterface = document.getElementById('decoration-interface');
const decorationOptions = document.querySelectorAll('.decoration-btn');
const saveDecorationBtn = document.getElementById('save-decoration');
const decorationsContainer = document.querySelector('.decorations');

// Initialize speech synthesis
const synth = window.speechSynthesis;

// Event Listeners
startBtn.addEventListener('click', startQuiz);
decorationOptions.forEach(btn => {
    btn.addEventListener('click', () => {
        const decorationType = btn.dataset.decoration;
        addDecoration(decorationType);
    });
});
saveDecorationBtn.addEventListener('click', saveDecorations);

function startQuiz() {
    gameState.isQuizActive = true;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    
    // Show question container and hide start button
    questionContainer.style.display = 'block';
    startBtn.style.display = 'none';
    
    updateScore();
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
    
    // Revert egg color back to normal after 1.5 seconds
    setTimeout(() => {
        changeEggState('normal');
    }, 1500);
    
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
        // Show decoration interface for perfect score
        decorationInterface.style.display = 'block';
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
        decorationInterface.style.display = 'none';
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

function addDecoration(type) {
    // Remove any existing decoration of the same type
    const existingDecoration = decorationsContainer.querySelector(`.${type}`);
    if (existingDecoration) {
        existingDecoration.remove();
        gameState.currentDecorations = gameState.currentDecorations.filter(d => d !== type);
    } else {
        // Add new decoration
        const decoration = document.createElement('div');
        decoration.className = `decoration ${type}`;
        decoration.textContent = btn.textContent;
        decorationsContainer.appendChild(decoration);
        gameState.currentDecorations.push(type);
    }
}

function saveDecorations() {
    localStorage.setItem('eggDecorations', JSON.stringify(gameState.currentDecorations));
    decorationInterface.style.display = 'none';
    alert('Your egg decoration has been saved! Other users will see your decorated egg.');
}

function loadDecorations() {
    const savedDecorations = localStorage.getItem('eggDecorations');
    if (savedDecorations) {
        const decorations = JSON.parse(savedDecorations);
        decorations.forEach(type => {
            const btn = document.querySelector(`.decoration-btn[data-decoration="${type}"]`);
            if (btn) {
                addDecoration(type);
            }
        });
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    // Set initial state
    questionContainer.style.display = 'none';
    optionsContainer.style.display = 'none';
    startBtn.style.display = 'block';
    questionText.textContent = '';
    scoreDisplay.textContent = 'Score: 0/7';
    changeEggState('normal');
    
    // Start button click handler
    startBtn.addEventListener('click', startQuiz);
    loadDecorations();
}); 