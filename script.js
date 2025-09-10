// Get the canvas and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 800;
canvas.height = 600;

// --- GAME STATE AND VARIABLES ---

let score = 0;
let missed = 0;
const missLimit = 5;
let gameOver = false;

// Player (Bucket) properties
const bucket = {
    x: canvas.width / 2 - 50,
    y: canvas.height - 70,
    width: 100,
    height: 60,
    speed: 15,
    dx: 0 // Direction of movement
};

// Shrimp properties
const shrimps = [];
const shrimpSpawnRate = 75; // Lower is faster
let frameCount = 0;

// Keyboard input handling
const keys = {
    ArrowRight: false,
    ArrowLeft: false
};

// --- EVENT LISTENERS ---

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        keys[e.key] = true;
    }
    // Restart game on 'Enter' key press if game is over
    if (e.key === 'Enter' && gameOver) {
        restartGame();
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        keys[e.key] = false;
    }
});

// --- DRAWING FUNCTIONS ---

// Function to draw the "anoma" background
function drawBackground() {
    ctx.fillStyle = 'rgba(20, 30, 40, 0.1)'; // Faint color
    ctx.font = '20px monospace';
    
    // Draw "anoma" about 100 times at random positions
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillText('anoma', x, y);
    }
}

// Function to draw the bucket
function drawBucket() {
    // Bucket body
    ctx.fillStyle = '#8B4513'; // SaddleBrown
    ctx.fillRect(bucket.x, bucket.y, bucket.width, bucket.height - 10);

    // Bucket rim
    ctx.fillStyle = '#A0522D'; // Sienna
    ctx.fillRect(bucket.x - 5, bucket.y, bucket.width + 10, 10);
}

// Function to draw a shrimp (using an emoji)
function drawShrimp(shrimp) {
    ctx.font = '40px serif';
    ctx.fillText('🦐', shrimp.x, shrimp.y);
}

// Function to draw the score and missed count
function drawUI() {
    ctx.fillStyle = '#c9d1d9';
    ctx.font = '24px sans-serif';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.fillText(`Missed: ${missed} / ${missLimit}`, canvas.width - 200, 40);
}

// --- GAME LOGIC FUNCTIONS ---

// Function to move the bucket based on keyboard input
function moveBucket() {
    // Reset horizontal movement
    bucket.dx = 0;

    if (keys.ArrowRight && bucket.x < canvas.width - bucket.width) {
        bucket.dx = bucket.speed;
    }
    if (keys.ArrowLeft && bucket.x > 0) {
        bucket.dx = -bucket.speed;
    }

    // Update bucket position
    bucket.x += bucket.dx;

    // Prevent bucket from going off-screen
    if (bucket.x < 0) bucket.x = 0;
    if (bucket.x + bucket.width > canvas.width) {
        bucket.x = canvas.width - bucket.width;
    }
}

// Function to create and manage shrimps
function handleShrimps() {
    // Spawn new shrimps periodically
    frameCount++;
    if (frameCount % shrimpSpawnRate === 0) {
        shrimps.push({
            x: Math.random() * (canvas.width - 40),
            y: -40, // Start above the screen
            speed: 2 + Math.random() * 2 // Random falling speed
        });
    }

    // Update and draw each shrimp
    for (let i = shrimps.length - 1; i >= 0; i--) {
        const shrimp = shrimps[i];
        
        // Move shrimp down
        shrimp.y += shrimp.speed;
        drawShrimp(shrimp);

        // Check for collision with bucket
        if (
            shrimp.x > bucket.x &&
            shrimp.x < bucket.x + bucket.width &&
            shrimp.y > bucket.y &&
            shrimp.y < bucket.y + bucket.height
        ) {
            score++;
            shrimps.splice(i, 1); // Remove caught shrimp
        } 
        // Check if shrimp is missed (falls off screen)
        else if (shrimp.y > canvas.height) {
            missed++;
            shrimps.splice(i, 1); // Remove missed shrimp
            if (missed >= missLimit) {
                gameOver = true;
            }
        }
    }
}

// Function to show the Game Over screen
function showGameOverScreen() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#e84a5f';
    ctx.font = '60px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);

    ctx.fillStyle = '#c9d1d9';
    ctx.font = '30px sans-serif';
    ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.font = '20px sans-serif';
    ctx.fillText('Press Enter to Play Again', canvas.width / 2, canvas.height / 2 + 70);
    
    ctx.textAlign = 'left'; // Reset alignment
}

// Function to restart the game
function restartGame() {
    score = 0;
    missed = 0;
    gameOver = false;
    shrimps.length = 0; // Clear the shrimps array
    bucket.x = canvas.width / 2 - 50;
    // Start the game loop again
    gameLoop();
}

// --- MAIN GAME LOOP ---

function gameLoop() {
    // Clear the entire canvas for the new frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the background first
    drawBackground();
    
    // Draw game elements
    drawBucket();
    drawUI();

    // Update game logic
    moveBucket();
    handleShrimps();

    // Check game state and continue loop if not over
    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        showGameOverScreen();
    }
}

// Start the game!
gameLoop();
