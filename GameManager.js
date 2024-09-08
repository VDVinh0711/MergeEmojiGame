

"use-strict"
//Global Variable
let canvas;
let context;




const TypeOfFruit =
{
    WaterMelon: 'WaterMelon',
    Banana: 'Banana',
    Apple: 'Apple',
    Mango: 'Mango',
    Pineapple: 'Pineapple',
    Cherry: 'Cherry',
}

const FruitDatas =
{
    WaterMelon:
    {
        type: TypeOfFruit.WaterMelon,
        color: '#4CAF50',
        radius: 30,
        point: 10,
    },
    Banana:
    {
        type: TypeOfFruit.Banana,
        color: '#FFEB3B',
        radius: 35,
        point: 20,
    },
    Apple:
    {
        type: TypeOfFruit.Apple,
        color: '#FF0800',
        radius: 40,
        point: 30,
    },
    Mango:
    {
        type: TypeOfFruit.Mango,
        color: '#FF8C00',
        radius: 45,
        point: 40,
    },
    Pineapple:
    {
        type: TypeOfFruit.Pineapple,
        color: '#D4AF37',
        radius: 50,
        point: 50,
    },
    Cherry:
    {
        type: TypeOfFruit.Cherry,
        color: '#DE3163 ',
        radius: 55,
        point: 60,
    },

}
const fomulaFruit = [TypeOfFruit.WaterMelon,
TypeOfFruit.Banana,
TypeOfFruit.Apple,
TypeOfFruit.Mango,
TypeOfFruit.Pineapple,
TypeOfFruit.Cherry
]

function GetRamdomTypeFruit() {
    const randomInex = Math.round(Math.random() * fomulaFruit.length / 2);
    return fomulaFruit[randomInex];

}

function GetAssetFruit(type) {
    return Object.values(FruitDatas).find(fruit => fruit.type === type);
}

function getNextFruit(current) {
    const curIndex = fomulaFruit.indexOf(current);
    const nextTypeFruit = fomulaFruit[curIndex + 1];
    return GetAssetFruit(nextTypeFruit);
}






//PlayerConfig
let playerPoint = 0;
let isWin = false;
let isLose = false;

//ConfigGame
let secondsPassed = 0; // aka delta time
let oldTimeStamp = 0;
let fps = 0;
//Helper
let particles = [];

let gameObjects = [];
let objDirection = [];
let fruitSpawm;
//VariableUntil
let isDrag = false;
let canSpawm = true;
const originTimeDelay = 0.3;
let timeDelaySpawm = 0.3;



//CofigBox
let rightBox;
let leftBox;
let bottomBox;
let topBox;


//Game Awake
window.onload = Init();
function Init() {
    canvas = document.getElementById("mainview");
    context = canvas.getContext('2d');


    rightBox = canvas.width / 2 + 200;
    leftBox = canvas.width / 2 - 200;
    bottomBox = canvas.height - 50;
    topBox = bottomBox - 400;
    window.requestAnimationFrame(gameLoop);
}



//Main Loop
function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);
    fps = Math.round(1 / secondsPassed);
    oldTimeStamp = timeStamp;

    gameUpdate(secondsPassed);
    gameColision();
    detectedColisionBox();
    gameDraw();
    window.requestAnimationFrame(gameLoop);
}


//Update
function gameUpdate(deltatime) {

    //Delay Spawm Fruit
    if (!canSpawm) {
        timeDelaySpawm -= deltatime;
        if (timeDelaySpawm <= 0) {
            canSpawm = true;
            timeDelaySpawm = originTimeDelay;
        }
    }

    // Update Obj
    gameObjects.forEach(gameObject => {
        gameObject.update(deltatime)
    });

    // Update Partcles
    particles.forEach((particle, index) => {
        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update(deltatime)
        }
    })
}


//Draw
function gameDraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBox();
    drawFps();
    drawPlayerPoint();

    //Draw gameObj
    gameObjects.forEach(gameObject => {
        gameObject.draw();
    });

    //Draw Point Direction
    objDirection.forEach(obj => {
        obj.draw();
    });

    //DrawParticels
    particles.forEach(particles => {
        particles.draw();
    });
}

//COlision
function gameColision() {
    //Reset Collision
    gameObjects.forEach(obj => {
        obj.isColiding = false;
    });

    //Check Colision
    for (let i = gameObjects.length - 1; i >= 0; i--) {
        const obj1 = gameObjects[i];
        for (let j = gameObjects.length - 1; j >= i + 1; j--) {
            const obj2 = gameObjects[j];
            if (obj1.CheckColision(obj2)) {
                const isMerge = TryMergFruit(obj1, obj2, j);
                if (!isMerge) {
                    const vRelavityVelocity =
                    {
                        x: obj1.vx - obj2.vx,
                        y: obj1.vy - obj2.vy
                    }
                    let speed = obj1.vColisionNor.x * vRelavityVelocity.x + obj1.vColisionNor.y * vRelavityVelocity.y;
                    obj1.updateV(speed, obj2.mass, -1);
                    obj2.updateV(speed, obj1.mass, 1);
                    obj1.isColiding = true;
                    obj2.isColiding = true;
                }
            }
        }
    }
}


//Utils

function drawBox() {
    context.lineWidth = 10;
    context.beginPath();
    context.moveTo(leftBox, topBox);
    context.lineTo(leftBox, bottomBox);
    context.lineTo(rightBox, bottomBox);
    context.lineTo(rightBox, topBox);
    context.stroke();
}

function drawFps() {
    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(`FPS:${fps}`, 0, 0);
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
}
function drawPlayerPoint() {

    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(`Player Point : ${playerPoint}`, 0, 50);
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
}

function createWorld() {
    gameObjects =
        [
            new Fruit(context, canvas.width / 2, canvas.height / 2, -10, 0, 20),
            new Fruit(context, 0, 0, 10, 0, 20)
        ]
}

function createDirection(posStart) {
    const spaceSize = 30;
    let posBegin =
    {
        x: posStart.x,
        y: posStart.y
    }
    for (let i = 0; i < 5; i++) {
        const newDot = new Dot(context, posBegin.x, posBegin.y);
        objDirection.push(newDot);
        posBegin.y += spaceSize;
    }
}






function detectedColisionBox() {
    gameObjects.forEach(gameObject => {

        if (gameObject.x < leftBox + gameObject.radius) {
            gameObject.vx = Math.abs(gameObject.vx) * 0.9;
            gameObject.x = leftBox + gameObject.radius;
        }
        else if (gameObject.x + gameObject.radius >= rightBox) {
            gameObject.vx = -Math.abs(gameObject.vx) * 0.9;
            gameObject.x = rightBox - gameObject.radius;
        }

        if (gameObject.y + gameObject.radius >= bottomBox &&
            gameObject.x > leftBox && gameObject.x < rightBox
        ) {
            gameObject.vx = Math.abs(gameObject.vx) * 0.5;
            gameObject.vy = -Math.abs(gameObject.vy) * 0.7;
            gameObject.y = bottomBox - gameObject.radius;
        }
    });
}



//Merg Obj
function TryMergFruit(obj1, obj2, index2) {
    if (obj1.type == obj2.type) {
        const fruitData = getNextFruit(obj1.type);

        //Check Win
        if (fruitData.type == TypeOfFruit.Cherry) {
            isWin = true;
            console.log(isWin);
        }
        //UpdateFruit
        obj1.updateFruit(fruitData.radius, fruitData.type, fruitData.color);
        gameObjects.splice(index2, 1);
        addPointPlayer(fruitData.point);


        //Create Partical
        for (let i = 0; i < obj1.radius * 2; i++) {
            particles.push(
                new Particle(context, obj1.x, obj1.y,
                    obj1.radius / 6,
                    obj1.color,
                    (Math.random() - 0.5) * (Math.random() * 6) * 100,
                    (Math.random() - 0.5) * (Math.random() * 6) * 100
                )
            )
        }

        return true;
    }
    return false;
}




//Mouse Event

document.addEventListener('mousedown', function (event) {

    if (isLose || isWin) return;
    if (!canSpawm) return;
    if (event.y >= topBox) return;
    isDrag = true;

    //Create Fruit
    const typeFruit = GetRamdomTypeFruit();
    const objFruit = GetAssetFruit(typeFruit);
    fruitSpawm = new Fruit(context, event.clientX, event.clientY, 0, 0, objFruit.radius, objFruit.type, objFruit.color);
    fruitSpawm.useGravity = false;
    gameObjects.push(fruitSpawm);

    //Direction
    createDirection({ x: event.clientX, y: event.clientY + fruitSpawm.radius });
});

document.addEventListener('mouseup', function (event) {
    if (!fruitSpawm) return;
    isDrag = false;
    objDirection = [];
    fruitSpawm.useGravity = true;
    canSpawm = false;

});

canvas.addEventListener('mousemove', function (event) {


    if (!isDrag) return;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (y >= topBox) {
        y = topBox - fruitSpawm.radius;
    }
    if (x <= leftBox) {
        x = leftBox + fruitSpawm.radius;
    }
    if (x >= rightBox) {
        x = rightBox - fruitSpawm.radius;
    }

    fruitSpawm.x = x;
    fruitSpawm.y = y;
    objDirection = [];
    createDirection({ x: x, y: y + fruitSpawm.radius });

});


function addPointPlayer(pointAdd) {
    playerPoint += pointAdd;
}