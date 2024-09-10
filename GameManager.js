

"use-strict"







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
let waypoints = [];
let textScore = [];
let fruitSpawm;
//VariableUntil
let isDrag = false;
let canSpawm = true;
const spawnTimeDelay = 0.5;
let currentSpawnDelay = 0.5;
let loseCountdownTime = 4;
const initialLoseCountdownTime = 4;


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
    createFormulaGuide(canvas.width - 70,  50);

    // Create Config Box
    rightBox = canvas.width / 2 + 300;
    leftBox = canvas.width / 2 - 300;
    bottomBox = canvas.height - 100;
    topBox = bottomBox - 500;
    window.requestAnimationFrame(gameLoop);
}

function ResGame() {
    isWin = false;
    isLose = false;
    currentSpawnDelay = spawnTimeDelay;
    loseCountdownTime = initialLoseCountdownTime;

    console.log(hightScore);
    particles = [];
    gameObjects = [];
    waypoints = [];
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
        currentSpawnDelay -= deltatime;
        if (currentSpawnDelay <= 0) {
            canSpawm = true;
            currentSpawnDelay = spawnTimeDelay;
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
    textScore.forEach((element, index) => {
        if (element.alpha <= 0) {
            textScore.splice(index, 1)
        } else {
            element.update(deltatime)
        }
    });

    //Check Lose
    if (isCollidingWithBoundary()) {
        loseCountdownTime -= deltatime;

        if (loseCountdownTime <= 0) {
            isLose = true;
            console.log("losse")
        }

    }
    else {
        loseCountdownTime = initialLoseCountdownTime;
    }
}


//Draw
function gameDraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);



    drawBackGround();

    drawZoneSpawm();
    drawBox();
    drawFps();
    drawPlayerPoint();
    drawHightScore();

    drawFormulaGuide();


  
    //Draw gameObj
    gameObjects.forEach(gameObject => {
        gameObject.draw();
    });

    drawWayPoints();

    //DrawParticels
    particles.forEach(particles => {
        particles.draw();
    });

    //Draw Score
    textScore.forEach(element => {
        element.draw();
    });


    
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
                const isMerge = MergedFruits(obj1, obj2, j);
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


function isCollidingWithBoundary() {
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
function InstantiateTextScore(posX, posY, score) {
    textScore.push(new TextScore(context, posX, posY, ` + ${score}`));
}

//Utils


function drawBox() {


    context.beginPath();
    context.fillStyle = 'white';
    context.rect(leftBox,topBox,rightBox-leftBox,bottomBox-topBox);
    context.fill();

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


function drawBackGround()
{
    context.beginPath();
    context.fillStyle = 'pink';
    context.rect(0,0,canvas.width,canvas.height);
    context.fill();
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
function createWayPoints(posStart) {
    const spaceSize = 30;
    let posBegin =
    {
        x: posStart.x,
        y: posStart.y
    }
    for (let i = 0; i < 5; i++) {
        const newDot = new Dot(context, posBegin.x, posBegin.y);
        waypoints.push(newDot);
        posBegin.y += spaceSize;
    }
}

function drawWayPoints() {
    //Draw Point Direction
    waypoints.forEach(obj => {
        obj.draw();
    });

}



//Create GuiD
function createFormulaGuide(x, y) {

    const space = 60;
    let listDataFruit = GetListFruitDatas();
    listDataFruit.forEach(fruit => {
        const assetFruit = GetAssetFruit(fruit);
        userGuide.push(new Fruit(context, x, y, 0, 0, assetFruit.radius, assetFruit.type, assetFruit.srcIMG));
        y += assetFruit.radius + space;
    });
}

//Draw Guid
function drawFormulaGuide() {
    userGuide.forEach(element => {
        element.draw();
    });
}


//Merge Obj
function MergedFruits(obj1, obj2, index2) {
    if (obj1.type == obj2.type) {
        const nextFruit = getNextFruit(obj1.type);
        //Check Win
        if (nextFruit.type == GetLastFruit()) {
            upDateHightScore(playerScore);
            isWin = true;
        }

        //UpdateFruit
        obj1.updateFruit(nextFruit.radius, nextFruit.type, nextFruit.srcIMG);
        gameObjects.splice(index2, 1);


        addPointPlayer(nextFruit.score);
        InstantiateTextScore(obj1.x, obj1.y - obj1.radius, nextFruit.score);


        //Create Partical
        createParticle(obj1.x, obj1.y);

        return true;
    }
    return false;
}

//Check Win

function createParticle(posX, posY) {
    for (let i = 0; i < 50; i++) {
        particles.push(
            new Particle(context, posX, posY,
                Math.floor(Math.random() * (15 - 10 + 1)) + 10,
                'yellow',
                (Math.random() - 0.5) * (Math.random() * 6) * 100,
                (Math.random() - 0.5) * (Math.random() * 6) * 100
            )
        )
    }
}

//Mouse Event



//On Mouse Down
document.addEventListener('mousedown', function (event) {



    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (!canSpawm) return;
    if (y >= topBox) return;


    //Create Fruit
    const typeFruit = GetRamdomTypeFruit();
    const objFruit = GetAssetFruit(typeFruit);
    fruitSpawm = new Fruit(context, x, y, 0, 0, objFruit.radius, objFruit.type, objFruit.srcIMG);
    fruitSpawm.useGravity = false;
    console.log(fruitSpawm.type);
    gameObjects.push(fruitSpawm);
    //Direction
    createWayPoints({ x: x, y: y + fruitSpawm.radius });
    isDrag = true;
});


//On Mouse Up
document.addEventListener('mouseup', function (event) {
    if (!fruitSpawm) return;
    isDrag = false;
    waypoints = [];
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
    waypoints = [];
    createWayPoints({ x: x, y: y + fruitSpawm.radius });

});




// SomeThing 
function addPointPlayer(score) {
    playerScore += score;
}

function upDateHightScore(score) {
    if (score > hightScore) {
        hightScore = score;
        
    }
}

btn_res.addEventListener('click', function () {
    ResGame();
});


function detectedColisionBox() {
    gameObjects.forEach(gameObject => {

        if (gameObject.x < leftBox + gameObject.radius) {
            gameObject.vx = Math.abs(gameObject.vx) * 0.5;
            gameObject.x = leftBox + gameObject.radius;
        }
        else if (gameObject.x + gameObject.radius >= rightBox) {
            gameObject.vx = -Math.abs(gameObject.vx) * 0.5;
            gameObject.x = rightBox - gameObject.radius;
        }

        if (gameObject.y + gameObject.radius >= bottomBox &&
            gameObject.x > leftBox && gameObject.x < rightBox
        ) {

            gameObject.vy = -Math.abs(gameObject.vy) * 0.7;
            gameObject.y = bottomBox - gameObject.radius;
        }
    });
}

