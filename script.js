const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const characterSelectDiv = document.getElementById('characterSelect');
const characterSelect = document.getElementById('characters');
const startGameButton = document.getElementById('startGame');

let carPosition = { x: canvas.width / 2, y: canvas.height - 150 };
let roadSpeed = 5;
let roadOffset = 0;
let moveLeft = false;
let moveRight = false;

const carImage = new Image();
carImage.src = 'images/car.png'; // Укажите путь к вашему изображению

const originalCarWidth = 613;
const originalCarHeight = 890;
const aspectRatio = originalCarWidth / originalCarHeight;

// Установим желаемую высоту машины
let carHeight = 150; // Например, 150 пикселей
let carWidth = carHeight * aspectRatio; // Рассчитываем ширину на основе соотношения сторон

carImage.onload = function() {
    startGameButton.addEventListener('click', () => {
        const selectedCharacter = characterSelect.value;
        console.log('Выбранный персонаж:', selectedCharacter);
        characterSelectDiv.style.display = 'none'; // Скрываем выбор персонажа
        gameLoop(); // Запускаем игру
    });
};

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    carPosition = { 
        x: (canvas.width - carWidth) / 2,
        y: canvas.height - carHeight - 100
    };
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Добавляем обработчики для нажатий на экран
canvas.addEventListener('pointerdown', (event) => {
    if (event.clientX < canvas.width / 2) {
        moveLeft = true;
    } else {
        moveRight = true;
    }
});

canvas.addEventListener('pointerup', () => {
    moveLeft = false;
    moveRight = false;
});

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
    ctx.drawImage(carImage, carPosition.x, carPosition.y, carWidth, carHeight);
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
