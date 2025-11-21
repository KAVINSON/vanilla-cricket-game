// --- Game State Variables ---
let runs = 0;
let wickets = 0;
let overs = 0;
const MAX_WICKETS = 5;
const MAX_OVERS = 5;
let target = 0;
let gamePhase = 'setup'; // 'setup', 'batting', 'chasing', 'finished'
let currentBall = 0;

// --- DOM Elements ---
const runsEl = document.getElementById('runs');
const wicketsEl = document.getElementById('wickets');
const oversEl = document.getElementById('overs');
const targetEl = document.getElementById('target');
const messageEl = document.getElementById('game-message');
const startBtn = document.getElementById('start-btn');
const battingControlsEl = document.getElementById('batting-controls');
const bowlingControlsEl = document.getElementById('bowling-controls');
const batBtns = document.querySelectorAll('.bat-btn');
const ballEl = document.getElementById('ball');
const wicketAreaEl = document.getElementById('wicket-area');

// --- Helper Functions ---

/**
 * Updates the scoreboard display.
 */
function updateScoreboard() {
    runsEl.textContent = runs;
    wicketsEl.textContent = wickets;
    // Format overs: total balls / 6
    const completedOvers = Math.floor(currentBall / 6);
    const ballsInOver = currentBall % 6;
    oversEl.textContent = `${completedOvers}.${ballsInOver}`;
}

/**
 * Generates a random score (0, 1, 2, 3, 4, 6) for the computer's 'bowl'.
 * @returns {number} The computer's chosen run.
 */
function getComputerBowl() {
    // Generate a number from 0 to 6 (exclusive of 5)
    const choices = [0, 1, 2, 3, 4, 6]; 
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

/**
 * Updates the game message and checks for game-ending conditions.
 * @param {string} msg - The message to display.
 */
function updateMessage(msg) {
    messageEl.textContent = msg;

    if (gamePhase === 'batting' && (wickets >= MAX_WICKETS || currentBall >= MAX_OVERS * 6)) {
        endInnings();
    } else if (gamePhase === 'chasing' && (wickets >= MAX_WICKETS || currentBall >= MAX_OVERS * 6)) {
        endGame('overs'); // Check win/loss condition based on score
    }
}

/**
 * Resets the ball animation to the starting position.
 */
function resetBallAnimation() {
    ballEl.classList.remove('ball-move');
    wicketAreaEl.classList.remove('wicket-down');
    // Force reflow to allow re-triggering animation
    void ballEl.offsetWidth; 
}

/**
 * Simulates the bowling and batting action, then updates the game state.
 * @param {number} playerRun - The run chosen by the player (0, 1, 2, 3, 4, 6).
 */
function playBall(playerRun) {
    // Disable controls while ball is in play
    battingControlsEl.classList.add('disabled-controls');
    
    resetBallAnimation();

    const computerBowl = getComputerBowl();

    // 1. Animation: Ball travels towards the wicket
    ballEl.classList.add('ball-move');

    // Display computer's choice briefly
    bowlingControlsEl.innerHTML = `<p>Computer bowled: **${computerBowl}**</p>`;
    bowlingControlsEl.classList.remove('hidden');
    battingControlsEl.classList.add('hidden');
    
    // After animation delay
    setTimeout(() => {
        // 2. Game Logic
        currentBall++;
        let resultMessage = '';

        if (playerRun === computerBowl) {
            // Wicket Logic
            wickets++;
            wicketAreaEl.classList.add('wicket-down'); // Animate wicket fall
            resultMessage = `OUT! Computer bowled ${computerBowl} and you chose ${playerRun}.`;
        } else {
            // Runs Logic
            runs += playerRun;
            resultMessage = `You scored **${playerRun}** run(s)! Computer bowled ${computerBowl}.`;
        }

        updateScoreboard();
        
        // 3. Check for end-game conditions and update message
        if (gamePhase === 'chasing' && runs > target) {
            endGame('score');
            return; // Stop further execution if game ended
        }

        updateMessage(resultMessage);
        
        // 4. Reset controls for the next ball/over
        bowlingControlsEl.classList.add('hidden');
        battingControlsEl.classList.remove('hidden');
        battingControlsEl.classList.remove('disabled-controls'); // Re-enable controls

    }, 300); // Matches the CSS transition time
}

// --- Game Phase Functions ---

/**
 * Starts the game and the first innings (Player Batting).
 */
function startGame() {
    // Reset state
    runs = 0;
    wickets = 0;
    currentBall = 0;
    target = 0;
    gamePhase = 'batting';
    targetEl.textContent = '---';

    updateScoreboard();
    updateMessage(`You are batting first. Try to score big in ${MAX_OVERS} overs!`);
    
    startBtn.classList.add('hidden');
    battingControlsEl.classList.remove('hidden');
    bowlingControlsEl.classList.add('hidden');
    resetBallAnimation();
    
    // Add event listeners to run buttons
    batBtns.forEach(btn => {
        // Ensure only one listener is attached
        btn.removeEventListener('click', handleBattingClick);
        btn.addEventListener('click', handleBattingClick);
    });
}

/**
 * Handles the click event for batting controls.
 * @param {Event} e - The click event.
 */
function handleBattingClick(e) {
    const playerRun = parseInt(e.target.dataset.run);
    playBall(playerRun);
}


/**
 * Ends the first innings, calculates the target, and starts the second innings (Chasing).
 */
function endInnings() {
    const playerScore = runs;
    target = playerScore + 1; // Target is one more than the score
    targetEl.textContent = target;

    // Reset for Chasing phase
    runs = 0;
    wickets = 0;
    currentBall = 0;
    gamePhase = 'chasing';

    updateScoreboard();
    updateMessage(`Innings break! You set a target of **${target}**. Now you must chase it!`);

    // Give the player a moment to read the message before starting the chase
    setTimeout(() => {
        updateMessage(`Chasing **${target}**. Choose your shot!`);
    }, 2000);
}

/**
 * Ends the entire game, determines the winner, and displays the final result.
 * @param {string} condition - 'score' (Target chased) or 'overs' (Overs/Wickets exhausted).
 */
function endGame(condition) {
    gamePhase = 'finished';
    battingControlsEl.classList.add('hidden');
    bowlingControlsEl.classList.add('hidden');
    startBtn.classList.remove('hidden');
    startBtn.textContent = 'Play Again';

    let finalMessage = 'Game Over! ';

    if (condition === 'score') {
        finalMessage += `**YOU WIN!** You successfully chased the target of ${target} with ${MAX_WICKETS - wickets} wickets remaining.`;
    } else if (condition === 'overs') {
        const remainingRuns = target - runs;

        if (runs >= target) {
             finalMessage += `**YOU WIN!** You successfully chased the target of ${target}!`;
        } else {
            finalMessage += `**YOU LOSE!** You needed ${remainingRuns} runs to win.`;
        }
    }

    messageEl.textContent = finalMessage;
}


// --- Initialization ---

startBtn.addEventListener('click', startGame);

// Initial call to set up the scoreboard
updateScoreboard();
