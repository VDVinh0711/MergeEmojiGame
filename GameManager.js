

"use-strict"




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
        radius: 15,
        score: 10,
    },
    Banana:
    {
        type: TypeOfFruit.Banana,
        color: '#FFEB3B',
        radius: 20,
        score: 20,
    },
    Apple:
    {
        type: TypeOfFruit.Apple,
        color: '#FF0800',
        radius: 25,
        score: 30,
    },
    Mango:
    {
        type: TypeOfFruit.Mango,
        color: '#FF8C00',
        radius: 30,
        score: 40,
    },
    Pineapple:
    {
        type: TypeOfFruit.Pineapple,
        color: '#D4AF37',
        radius: 35,
        score: 50,
    },
    Cherry:
    {
        type: TypeOfFruit.Cherry,
        color: '#DE3163 ',
        radius: 40,
        score: 60,
    },

}
const listFruits = [TypeOfFruit.WaterMelon,
TypeOfFruit.Banana,
TypeOfFruit.Apple,
TypeOfFruit.Mango,
TypeOfFruit.Pineapple,
TypeOfFruit.Cherry
]

function GetRamdomTypeFruit() {
    const randomInex = Math.round(Math.random() * listFruits.length / 2);
    return listFruits[randomInex];

}

function GetAssetFruit(type) {
    return Object.values(FruitDatas).find(fruit => fruit.type === type);
}

function getNextFruit(current) {
    const curIndex = listFruits.indexOf(current);
    const nextTypeFruit = listFruits[curIndex + 1];
    return GetAssetFruit(nextTypeFruit);
}




//Global Variable
let canvas;
let context;

let btn_res = document.getElementById("btn_resGame");






//PlayerConfig
let playerScore = 0;
let isWin = false;
let isLose = false;
let hightScore = 0;

//ConfigGame
let secondsPassed = 0; // aka delta time
let oldTimeStamp = 0;
let fps = 0;

//Helper
let particles = [];
let userGuide = [];
let gameObjects = [];
let objDirection = [];
let textScore = [];
let fruitSpawm;
//VariableUntil
let isDrag = false;
let canSpawm = true;
const originTimeDelay = 0.5;
let timeDelaySpawm = 0.5;
let timeCountDownLose = 4;
const timeOriginCountDown = 4;


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


    //Create Guid
    createUserGuild(40, canvas.height - 20);

    // Create Config Box
    rightBox = canvas.width / 2 + 200;
    leftBox = canvas.width / 2 - 200;
    bottomBox = canvas.height - 50;
    topBox = bottomBox - 400;
    window.requestAnimationFrame(gameLoop);
}

function ResGame() {
    isWin = false;
    isLose = false;
    timeDelaySpawm = originTimeDelay;
    timeCountDownLose = timeOriginCountDown;

    particles = [];
    gameObjects = [];
    objDirection = [];
    playerScore = 0;
}

//Main Loop
function gameLoop(timeStamp) {


    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);
    fps = Math.round(1 / secondsPassed);
    oldTimeStamp = timeStamp;

    if (!isLose && !isWin) {
        gameUpdate(secondsPassed);
        gameColision();
        detectedColisionBox();
        gameDraw();
    }

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


    //Update TextScore
    textScore.forEach((element,index) => {
        if (element.alpha <= 0) {
            textScore.splice(index, 1)
        } else {
            element.update(deltatime)
        }
    });

    //Check Lose
    if (ColiWithBarie()) {
        timeCountDownLose -= deltatime;

        if (timeCountDownLose <= 0) {
            isLose = true;
            console.log("losse")
        }

    }
    else {
        timeCountDownLose = timeOriginCountDown;
    }
}


//Draw
function gameDraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
   



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

    //Draw Score
    textScore.forEach(element => {
        element.draw();
    });


    drawZoneSpawm();
    drawBox();
    drawFps();
    drawPlayerPoint();
    drawHightScore();
    
    drawUserGuild();
}

//COlision
function gameColision() {
    //Reset Collision
    gameObjects.forEach(obj => {
        obj.isColiding = false;
    });

    //Check Colision With Us
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
                    obj1.handelColison();
                    obj2.handelColison();
                }
            }
        }
    }


}


function ColiWithBarie() {
    let holder = [];
    for (let i = 0; i < gameObjects.length; i++) {
        if (!gameObjects[i].canCheckLose) continue;
        if (gameObjects[i].y <= topBox) {
            holder.push(gameObjects[i]);
        }
    }
    return holder.length > 0;
}



//Instantiate Text Score
function InstantiaTextScore( posX, posY,score)
{
    textScore.push(new TextScore( context,posX,posY,` ${score}`));
}

//Utils



//Draw Guid
function drawUserGuild() {
    userGuide.forEach(element => {
        element.draw();
    });
}

function drawBox() {
    context.beginPath();
    context.lineWidth = 10;
    context.strokeStyle = 'black';
    context.moveTo(leftBox, topBox);
    context.lineTo(leftBox, bottomBox);
    context.lineTo(rightBox, bottomBox);
    context.lineTo(rightBox, topBox);
    context.stroke();
}

function drawZoneSpawm() {
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = 'red';
    context.rect(leftBox, 0, rightBox - leftBox, topBox);
    context.stroke();
}

//Draw Fps
function drawFps() {
    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(`FPS:${fps}`, 0, 0);
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
}

//Draw Player Point
function drawPlayerPoint() {

    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(`Score : ${playerScore}`, 0, 50);
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
}

//Draw Height  Score
function drawHightScore() {
    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(`Hight Score : ${hightScore}`, 0, 80);
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
}


//Create Direction
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

//Create GuiD
function createUserGuild(x, y) {

    const space = 50;
    listFruits.forEach(fruit => {
        const assetFruit = GetAssetFruit(fruit);
        userGuide.push(new Fruit(context, x, y, 0, 0, assetFruit.radius, assetFruit.type, assetFruit.color));
        x += assetFruit.radius + space;
    });
}




//Merg Obj
function TryMergFruit(obj1, obj2, index2) {
    if (obj1.type == obj2.type) {
        const fruitData = getNextFruit(obj1.type);

        //Check Win
        if (fruitData.type == TypeOfFruit.Cherry) {
            upDateHightScore(playerScore);
            isWin = true;
            console.log(isWin);
        }
        //UpdateFruit
        obj1.updateFruit(fruitData.radius, fruitData.type, fruitData.color);
        gameObjects.splice(index2, 1);
        addPointPlayer(fruitData.score);
        InstantiaTextScore(obj1.x,obj1.y - obj1.radius,fruitData.score);
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


//On Mouse Down
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


//On Mouse Up
document.addEventListener('mouseup', function (event) {
    if (!fruitSpawm) return;
    isDrag = false;
    objDirection = [];
    fruitSpawm.useGravity = true;

    canSpawm = false;


});


//On Mouse Drag
canvas.addEventListener('mousemove', function (event) {


    if (!isDrag) return;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (y >= topBox) {
        y = topBox - fruitSpawm.radius;
    }
    if (x <= leftBox + fruitSpawm.radius) {
        x = leftBox + fruitSpawm.radius;
    }
    if (x >= rightBox - fruitSpawm.radius) {
        x = rightBox - fruitSpawm.radius;
    }

    fruitSpawm.x = x;
    fruitSpawm.y = y;
    objDirection = [];
    createDirection({ x: x, y: y + fruitSpawm.radius });

});




// SomeThing 
function addPointPlayer(score) {
    playerScore += score;
}

function upDateHightScore(score) {
    if (score < hightScore) {
        hightScore = score;
    }
}

btn_res.addEventListener('click', function () {
    ResGame();
});


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

