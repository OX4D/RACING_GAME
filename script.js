const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const characterSelectDiv = document.getElementById('characterSelect');
const characterSelect = document.getElementById('characters');
const startGameButton = document.getElementById('startGame');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');

let selectedCharacter;
let carPosition = { x: canvas.width / 2, y: canvas.height - 100 };
let carWidth = 50;
let carHeight = 100;
let roadSpeed = 5;
let roadOffset = 0;
let moveLeft = false;
let moveRight = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carPosition = { x: canvas.width / 2, y: canvas.height - carHeight - 10 };
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

startGameButton.addEventListener('click', () => {
    selectedCharacter = characterSelect.value;
    console.log('Выбранный персонаж:', selectedCharacter);
    characterSelectDiv.style.display = 'none'; // Скрываем выбор персонажа
    document.getElementById('controls').style.display = 'flex'; // Показываем кнопки управления
    gameLoop(); // Запускаем игру
});

leftButton.addEventListener('pointerdown', () => moveLeft = true);
leftButton.addEventListener('pointerup', () => moveLeft = false);
rightButton.addEventListener('pointerdown', () => moveRight = true);
rightButton.addEventListener('pointerup', () => moveRight = false);

function update() {
    roadOffset += roadSpeed;
    if (roadOffset > canvas.height) {
        roadOffset = 0;
    }

    if (moveLeft) carPosition.x -= 5;
    if (moveRight) carPosition.x += 5;

    if (carPosition.x < 0) carPosition.x = 0;
    if (carPosition.x > canvas.width - carWidth) carPosition.x = canvas.width - carWidth;
}

function drawRoad() {
    ctx.fillStyle = '#555';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#777';
    for (let i = -1; i < canvas.height / 40; i++) {
        ctx.fillRect(canvas.width / 2 - 5, i * 40 + roadOffset, 10, 20);
    }
}

function drawCar() {
    ctx.fillStyle = 'red';
    ctx.fillRect(carPosition.x, carPosition.y, carWidth, carHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawCar();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
