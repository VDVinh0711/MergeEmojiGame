import { Dot } from '../Classes/Dot.js';
import EmojiDatas from '../EmojiDataManager.js';
import { Particle } from '../Classes/Particle.js';
import { TextScore } from '../Classes/TextScore.js'
import { Emoji } from '../Classes/Emoji.js';
import {GameRenderer} from './GameRenderer.js';
import {GameManager} from '../GameMangerv2.js';

"use-strict"








//Global Variable
let canvas;
let context;

let btn_res = document.getElementById("btn_resGame");






//PlayerConfig
let playerScore = 0;
let isWin = false;
let isLose = false;
let bestTime = 0;

//ConfigGame
let secondsPassed = 0; // aka delta time
let oldTimeStamp = 0;
let fps = 0;
let timeManager = 0;

let gameRenderer;
//Helper
let particles = [];
let userGuide = [];
let gameObjects = [];
let waypoints = [];
let textScore = [];
let newEmoji;
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
    createFormulaGuide(canvas.width - 70, 50);

    // Create Config Box
    rightBox = canvas.width / 2 + 300;
    leftBox = canvas.width / 2 - 300;
    bottomBox = canvas.height - 100;
    topBox = bottomBox - 500;

    gameRenderer = new GameRenderer(context,canvas);
    testSpawm();
    window.requestAnimationFrame(gameLoop);
}

//ResGame
function ResGame() {
    isWin = false;
    isLose = false;
    currentSpawnDelay = spawnTimeDelay;
    loseCountdownTime = initialLoseCountdownTime;

    timeManager = 0;
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

    timeManager = Math.round((timeManager + secondsPassed) * 100) / 100

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

    //Delay Spawm Emoji
    if (!canSpawm) {
        currentSpawnDelay -= deltatime;
        if (currentSpawnDelay <= 0) {
            canSpawm = true;
            currentSpawnDelay = spawnTimeDelay;
        }
    }


    for(let i = 0 ;i< gameObjects.length ;i++)
    {
        if(gameObjects[i].canMerge) continue;
        gameObjects[i].updateCanMerge(topBox);
        
    }
   
    // Update Obj
    gameObjects.forEach(gameObject => {
        gameObject.update(deltatime)
    });

   



    Particle.updateListParticles(deltatime);


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



    //drawBackGround();

   // gameRenderer.render();

    drawTime();
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

    //DrawParticle
    Particle.drawListParticles();

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
                const isMerge = MergedEmojis(obj1, obj2, j);
                if (!isMerge) {
                    resolveCollision(obj1,obj2);
                    obj1.handleColison();
                    obj2.handleColison();
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



function resolveCollision(obj1, obj2) {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = (obj1.radius + obj2.radius) - distance;
    
    if (overlap > 0) {
        // Di chuyển các đối tượng ra khỏi nhau
        const moveX = (overlap * dx) / distance / 2;
        const moveY = (overlap * dy) / distance / 2;
        
        obj1.x -= moveX;
        obj1.y -= moveY;
        obj2.x += moveX;
        obj2.y += moveY;
        
        // Tính toán vận tốc mới
        const nx = dx / distance;
        const ny = dy / distance;
        const p = 2 * (nx * (obj2.vx - obj1.vx) + ny * (obj2.vy - obj1.vy)) / (obj1.mass + obj2.mass);
        
        obj1.vx += p * obj2.mass * nx;
        obj1.vy += p * obj2.mass * ny;
        obj2.vx -= p * obj1.mass * nx;
        obj2.vy -= p * obj1.mass * ny;
    }
}





//Instantiate Text Score
function InstantiateTextScore(posX, posY, score) {
    textScore.push(new TextScore(context, posX, posY, ` + ${score}`));
}

//Utils



function drawTime() {
    context.beginPath();
    context.fillStyle = 'black';
    context.fillText(`Time Game : ${timeManager}`, 0, 110);
    context.font = '20px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
}

function drawBox() {


    context.beginPath();
    context.fillStyle = 'white';
    context.rect(leftBox, topBox, rightBox - leftBox, bottomBox - topBox);
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


function drawBackGround() {
    context.beginPath();
    context.fillStyle = 'pink';
    context.rect(0, 0, canvas.width, canvas.height);
    context.fill();
}

//Draw Fps
function drawFps() {
    context.beginPath();
    context.fillStyle = 'black';
    context.font = '40px Arial';
    context.textAlign = 'left';
    context.textBaseline = 'top';
    context.fillText(`FPS:${fps}`, 0, 0);
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
    context.fillText(`Hight Score : ${bestTime}`, 0, 80);
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
    let listDataEmojis = EmojiDatas.GetListEmojiDatas();
    listDataEmojis.forEach(emoji => {
        const assetEmoji = EmojiDatas.GetAssetEmoji(emoji);
        userGuide.push(new Emoji(context, x, y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG));
        y += assetEmoji.radius + space;
    });
}

//Draw Guid
function drawFormulaGuide() {
    userGuide.forEach(element => {
        element.draw();
    });
}


//Merge Obj
function MergedEmojis(obj1, obj2, index2) {
    if (obj1.type == obj2.type && obj1.canMerge && obj2.canMerge) {
        const nextEmoji = EmojiDatas.getNextEmoji(obj1.type);
        //Check Win
        if (nextEmoji.type == EmojiDatas.GetLastEmoji()) {
            upDateBestTime(timeManager);
            isWin = true;
        }

        //UpdateEmoji
        obj1.updateModelEmoji(nextEmoji.radius, nextEmoji.type, nextEmoji.srcIMG);
        gameObjects.splice(index2, 1);


        addPointPlayer(nextEmoji.score);
        InstantiateTextScore(obj1.x, obj1.y - obj1.radius, nextEmoji.score);


        //Create Partical
      
        Particle.createParticels(context,obj1.x,obj1.y);

        return true;
    }
    return false;
}

//Check Win

//Mouse Event



//On Mouse Down
document.addEventListener('mousedown', function (event) {
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;


    if (!canSpawm) return;
    if (y >= topBox) return;
    console.log("click");

    //Create Emoji
    const emojiType = EmojiDatas.GetRandomTypeEmoji();
    const assetEmoji = EmojiDatas.GetAssetEmoji(emojiType);
    newEmoji = new Emoji(context, x, y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG);
    newEmoji.useGravity = false;
    gameObjects.push(newEmoji);
    //Direction
    createWayPoints({ x: x, y: y + newEmoji.radius });
    isDrag = true;
});


//On Mouse Up
document.addEventListener('mouseup', function (event) {
    if (!newEmoji) return;
    isDrag = false;
    waypoints = [];
    newEmoji.useGravity = true;
    canSpawm = false;
});


//On Mouse Drag
canvas.addEventListener('mousemove', function (event) {
    if (!isDrag) return;
    const rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    if (y >= topBox) {
        y = topBox - newEmoji.radius;
    }
    if (x <= leftBox + newEmoji.radius) {
        x = leftBox + newEmoji.radius;
    }
    if (x >= rightBox - newEmoji.radius) {
        x = rightBox - newEmoji.radius;
    }

    newEmoji.x = x;
    newEmoji.y = y;
    waypoints = [];
    createWayPoints({ x: x, y: y + newEmoji.radius });

});


// SomeThing 
function addPointPlayer(score) {
    playerScore += score;
}

function upDateBestTime(time) {
    if (time < bestTime) {
        bestTime = time;
    }
    if (bestTime == 0) {
        bestTime = time;
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
            gameObject.vy = -Math.abs(gameObject.vy) * 0.5;
            gameObject.vx *= 0.95; // Thêm ma sát
            gameObject.y = bottomBox - gameObject.radius;
        }
    });
}





function testSpawm() {
    let min = leftBox;
    let max = rightBox;
    for (let i = 0; i < 1; i++) {
        let x = Math.floor(Math.random() * (max - min + 1)) + min;
        let y = Math.floor(Math.random() * (topBox - 0 + 1)) + 0;
        const emojiType = EmojiDatas.GetRandomTypeEmoji();
        const assetEmoji = EmojiDatas.GetAssetEmoji(emojiType);
        newEmoji = new Emoji(context, x, y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG);
        newEmoji.useGravity = true;
        gameObjects.push(newEmoji);
    }
}