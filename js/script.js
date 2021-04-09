//Обращаемся к игровому полю в HTML
let canvas = document.getElementById("game");
//Делаем поле двухмерным
let context = canvas.getContext("2d");
//Размер игровой клетки
let grid = 15;
//Высота платформы
let paddleHeight = grid * 5;
//Скорость платформы
let paddleSpeed = 3;
//Число определяющее полет мяча
let randomNumber = Math.random().toFixed(1) * 10;
//Скорость мяча
let ballSpeed = 2;
//Обозначим границы для платоформы
let maxPaddleY = canvas.height - grid - paddleHeight;
//Счетчик отбивания мяча
let counter = 1;
//Счетчик побед первого и второго игроков
let win_counter1 = 0;
let win_counter2 = 0;
//Описываем левую платформу
let leftPaddle = {
    //указываем начальные координаты платформы
    x: grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    //Высота платформы
    height: paddleHeight,
    //Ширина платформы
    width: grid,
    //Направление движения
    dy: 0
}

//Описываем правую платформу
let rightPaddle = {
    //указываем начальные координаты платформы
    x: canvas.width - grid * 2,
    y: canvas.height / 2 - paddleHeight / 2,
    //Высота платформы
    height: paddleHeight,
    //Ширина платформы
    width: grid,
    //Направление движения
    dy: 0
}
//Описываем мяч
let ball = {
    //Начальное положение мяча
    x: canvas.width / 2,
    y: canvas.height / 2,
    //Ширина и высота мяча
    width: grid,
    height: grid,
    //Начальное ускорение
    dx: ballSpeed,
    dy: -ballSpeed
}
//Ввод имён игроков
let name_1 = prompt("Имя первого игрока:", "Player1");
let name_2 = prompt("Имя второго игрока:", "Player2");
//Главный цикл игры
function loop(){
    //Если мяч вылетел за границы - начинаем заново
    if (ball.x < leftPaddle.x || ball.x > rightPaddle.x){
        if (ball.x < leftPaddle.x){
            win_counter1 += 1;
            document.getElementById('player_1').textContent = "Побед у "+ name_2 + ": " + win_counter1;
        }
        else if (ball.x > rightPaddle.x){
            win_counter2 += 1;
            document.getElementById('player_2').textContent = "Побед у " + name_1 + ": " + win_counter2;
        }
        //Ставим шарик в начальное положение
        ball.dx = 0;
        ball.dy = 0;
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        rightPaddle.x = canvas.width - grid * 2;
        rightPaddle.y = canvas.height / 2 - paddleHeight / 2;
        leftPaddle.x = grid * 2;
        leftPaddle.y = canvas.height / 2 - paddleHeight / 2;
        setTimeout(() => {
            //Число определяющее полет мяча
            randomNumber = Math.random().toFixed(1) * 10;
            //Переопределяем переменные
            ballSpeed = 2;
            counter = 0;
            //Меняем шарику скорость
            ball.dx = ballSpeed;
            ball.dy = -ballSpeed;
            //Ставим правую платформу в начальное положение
            rightPaddle.dy = 0;
            rightPaddle.width = grid;
            rightPaddle.height = paddleHeight;
            //Ставим левую платформу в начальное положение
            leftPaddle.dy = 0;
            leftPaddle.width = grid;
            leftPaddle.height = paddleHeight;}, 1000);
        sound("explosion");
    }
    //Если мяч отбили 5 раз - делаем его быстрее
    if (counter % 5 == 0){
        counter += 1;
        if (ball.dx > 0){
            ball.dx += 0.5;
            if (ball.dy > 0){
                ball.dy += 0.5;
            }else{
                ball.dy -= 0.5;
            }
        }else{
            ball.dx -= 0.5;
            if (ball.dy > 0){
                ball.dy += 0.5
            }else{
                ball.dy -= 0.5;
            }
        }
    }
    //Очищаем игровое поле
    requestAnimationFrame(loop);
    context.clearRect(0, 0, canvas.width, canvas.height);

    //Если платформы куда-то двигались - путь продолжают
    leftPaddle.y += leftPaddle.dy;
    rightPaddle.y += rightPaddle.dy;
    //Проверка выхода за границы холста левой платформы
    //Ушла ли платформа вверх
    if(leftPaddle.y <= grid){
        leftPaddle.y = grid;
    }
    //Ушла ли платформа вниз
    if(leftPaddle.y > maxPaddleY){
        leftPaddle.y = maxPaddleY;
    }

    //Проверка выхода за границы холста правой платформы
    //Ушла ли платформа вверх
    if(rightPaddle.y <= grid){
        rightPaddle.y = grid;
    }
    //Ушла ли платформа вниз
    if(rightPaddle.y > maxPaddleY){
        rightPaddle.y = maxPaddleY;
    }

    //Задаем цвет
    context.fillStyle = 'white';
    //Рисуем платформы
    context.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    context.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    context.fillRect(0, 0, canvas.width, grid);
    context.fillRect(0, canvas.height - grid, canvas.width, grid);
    for(let i = grid; i < canvas.height - grid; i += grid*2)
        context.fillRect(canvas.width / 2 - grid / 2, i, grid, grid);
    
    //Задаем цвет
    context.fillStyle = 'green';
    //Рисуем мяч
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    
    //Если мяч двигался, то пусть продолжает
    if (randomNumber <= 5){
        ball.x += ball.dx;
    }else{
        ball.x -= ball.dx;
    }
    ball.y += ball.dy;
    //Если мяч коснулся стенки направляем его в противоположную сторону
    if (ball.y <= grid){
        ball.dy *= -1;
    }
    if (ball.y + grid >= canvas.height - grid){
        ball.dy *= -1;
    }
    //Отслеживаем нажатия клавишь
    document.addEventListener("keydown", function(e){
        //Если нажата стрелка вверх
        if(e.which == 38){
            //Двигаем правую платформу вверх
            rightPaddle.dy = -paddleSpeed;
        }
        //Иначе если нажата стрелка вниз
        else if(e.which == 40){
            //Двигаем правую платформу вниз
            rightPaddle.dy = paddleSpeed;
        }
        //Иначе если нажата W
        else if(e.which == 87){
            //Двигаем левую платформу вверх
            leftPaddle.dy = -paddleSpeed;
        }
        //Иначе если нажата S
        else if(e.which == 83){
            //Двигаем левую платформу вниз
            leftPaddle.dy = paddleSpeed;
        }
    })
    document.addEventListener("keyup", function(e){
        //Если отпущена стрелка вверх
        if(e.which == 38){
            //Двигаем правую платформу вверх
            rightPaddle.dy = 0;
        }
        //Иначе если отпущена стрелка вниз
        else if(e.which == 40){
            //Двигаем правую платформу вниз
            rightPaddle.dy = 0;
        }
        //Иначе если отпущена W
        else if(e.which == 87){
            //Двигаем левую платформу вверх
            leftPaddle.dy = 0;
        }
        //Иначе если отпущена S
        else if(e.which == 83){
            //Двигаем левую платформу вниз
            leftPaddle.dy = 0;
        }
    })
    //Если мяч коснулся платформ
    if (collides(ball, rightPaddle)){
        sound("pop");
        ball.dx *= -1;
        counter += 1;
    }
    else if (collides(ball, leftPaddle)){
        sound("pop");
        ball.dx *= -1;
        counter += 1;
    }
}

//Запуск игры
requestAnimationFrame(loop);

//Функция проверки пересечения платформ
function collides(object1, object2){
    return object1.x < object2.x + object2.width &&
           object1.x + object1.width > object2.x &&
           object1.y < object2.y + object2.height &&
           object1.y + object1.height > object2.y;
}

//Запуск звука
function sound(name){
    let audio = new Audio();
    audio.src = "src\\music\\" + name + ".mp3";
    audio.autoplay = true;
}