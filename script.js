const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const characterSelectDiv = document.getElementById('characterSelect');
const characterSelect = document.getElementById('characters');
const startGameButton = document.getElementById('startGame');

let carPosition = { x: canvas.width / 2, y: canvas.height - 150 };
let roadSpeed = 5; // Уменьшили скорость для более медленного движения
let roadOffset = 0;
let moveLeft = false;
let moveRight = false;
let distance = 0;

const carImage = new Image();
carImage.src = 'images/car.png'; // Укажите путь к вашему изображению

const botCarImage = new Image();
botCarImage.src = 'images/car2.png'; // Укажите путь к изображению машины-бота

const originalCarWidth = 613;
const originalCarHeight = 890;
const aspectRatio = originalCarWidth / originalCarHeight;

// Установим желаемую высоту машины
let carHeight = 150; // Например, 150 пикселей
let carWidth = carHeight * aspectRatio; // Рассчитываем ширину на основе соотношения сторон

let botCars = []; // Массив для хранения машин-ботов

carImage.onload = function() {
    startGameButton.addEventListener('click', () => {
        const selectedCharacter = characterSelect.value;
        console.log('Выбранный персонаж:', selectedCharacter);
        characterSelectDiv.style.display = 'none'; // Скрываем выбор персонажа
        initializeBots(); // Инициализируем ботов
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

function initializeBots() {
    // Создаём меньше машин-ботов
    for (let i = 0; i < 3; i++) { // Уменьшили количество ботов до 3
        let bot;
        let attempts = 0;
        do {
            bot = {
                x: Math.random() * (canvas.width - carWidth),
                y: -Math.random() * canvas.height,
                speed: roadSpeed // Установили скорость ботов равной скорости дороги
            };
            attempts++;
        } while (isOverlapping(bot) && attempts < 10); // Ограничиваем количество попыток
        botCars.push(bot);
    }
}

function isOverlapping(newBot) {
    return botCars.some(bot => {
        return (
            newBot.x < bot.x + carWidth &&
            newBot.x + carWidth > bot.x &&
            newBot.y < bot.y + carHeight &&
            newBot.y + carHeight > bot.y
        );
    });
}

function update() {
    roadOffset += roadSpeed;
    if (roadOffset > 60) { // Увеличили высоту для более редких пунктиров
        roadOffset = 0;
    }

    if (moveLeft) carPosition.x -= 3; // Уменьшили скорость движения влево
    if (moveRight) carPosition.x += 3; // Уменьшили скорость движения вправо

    if (carPosition.x < 0) carPosition.x = 0;
    if (carPosition.x > canvas.width - carWidth) carPosition.x = canvas.width - carWidth;

    distance += 0.05; // Уменьшили прирост расстояния

    // Обновляем позиции машин-ботов
    botCars.forEach(bot => {
        bot.y += bot.speed;
        if (bot.y > canvas.height) {
            let attempts = 0;
            do {
                bot.y = -carHeight;
                bot.x = Math.random() * (canvas.width - carWidth);
                attempts++;
            } while (isOverlapping(bot) && attempts < 10); // Ограничиваем количество попыток
        }
    });
}

function drawRoad() {
    ctx.fillStyle = '#333'; // Цвет дороги
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#FFF'; // Цвет полос
    const lineWidth = 10; // Увеличили ширину полосы
    const lineHeight = 30; // Высота полосы
    const lineSpacing = 30; // Расстояние между полосами
    for (let i = -1; i < canvas.height / (lineHeight + lineSpacing); i++) {
        ctx.fillRect(canvas.width / 2 - lineWidth / 2, i * (lineHeight + lineSpacing) + roadOffset, lineWidth, lineHeight);
    }

    // Рисуем границы дороги
    ctx.fillStyle = '#FFF';
    ctx.fillRect(0, 0, 10, canvas.height); // Левая граница
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height); // Правая граница
}

function drawCar() {
    ctx.drawImage(carImage, carPosition.x, carPosition.y, carWidth, carHeight);
}

function drawBotCars() {
    botCars.forEach(bot => {
        ctx.drawImage(botCarImage, bot.x, bot.y, carWidth, carHeight);
    });
}

function drawDistance() {
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Расстояние: ${Math.floor(distance)} м`, 10, 30);
}

function drawVignette() {
    const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width / 3,
        canvas.width / 2, canvas.height / 2, canvas.width / 1.1
    );
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)'); // Прозрачный центр
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)'); // Менее непрозрачные края

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRoad();
    drawVignette(); // Рисуем эффект виньетки перед машинами
    drawBotCars(); // Рисуем машины-боты
    drawCar(); // Рисуем машину игрока
    drawDistance();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}