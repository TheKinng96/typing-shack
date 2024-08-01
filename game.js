const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let wordText;
let inputText;
let scoreText;
let timerText;
let wpmText;
let currentWord;
let inputString = '';
let score = 0;
let startTime;
let correctWords = 0;
let gameOver = false;

const words = ["hello", "world", "phaser", "javascript", "typing"];

function preload() {
  // Load any assets here if needed
}

function create() {
  // Initialize text elements
  wordText = this.add.text(400, 300, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  inputText = this.add.text(400, 400, '', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  timerText = this.add.text(16, 50, 'Time: 60', { fontSize: '32px', fill: '#fff' });
  wpmText = this.add.text(16, 84, 'WPM: 0', { fontSize: '32px', fill: '#fff' });

  // Display the initial word
  nextWord();

  // Start the timer
  startTime = new Date();

  // Capture keyboard input
  this.input.keyboard.on('keydown', handleInput, this);
}

function update() {
  if (!gameOver) {
    // Update the input text display
    inputText.setText(inputString);

    // Calculate elapsed time
    const elapsedTime = (new Date() - startTime) / 1000; // in seconds

    // Update timer
    const remainingTime = Math.max(60 - Math.floor(elapsedTime), 0);
    timerText.setText('Time: ' + remainingTime);

    if (remainingTime === 0) {
      endGame();
    }
  }
}

function handleInput(event) {
  if (!gameOver) {
    if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
      inputString += event.key;
    } else if (event.key === "Backspace") {
      inputString = inputString.slice(0, -1);
    } else if (event.key === "Enter") {
      checkWord();
    }
  }
}

function checkWord() {
  if (inputString === currentWord) {
    score += 10;
    correctWords += 1;
    scoreText.setText('Score: ' + score);
    nextWord();
  }
  inputString = '';
}

function nextWord() {
  if (words.length > 0) {
    currentWord = Phaser.Utils.Array.RemoveRandomElement(words);
    wordText.setText(currentWord);
  } else {
    endGame();
  }
}

function endGame() {
  gameOver = true;
  wordText.setText('Game Over');

  // Calculate and display final WPM
  const elapsedTime = (new Date() - startTime) / 1000 / 60; // in minutes
  const wpm = (correctWords / elapsedTime).toFixed(2);
  wpmText.setText('WPM: ' + wpm);

  this.input.keyboard.off('keydown', handleInput);
}
