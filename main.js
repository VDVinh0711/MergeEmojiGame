import {GameManager} from './GameCore/GameManger.js';

let gameManager;

let deltaTime = 0; // aka delta time
let oldTimeStamp = 0;
window.onload = init();

function init() {
    gameManager = new GameManager();
    requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {
    
    deltaTime = (timeStamp - oldTimeStamp) / 1000;
    deltaTime = Math.min(deltaTime, 0.1);
    oldTimeStamp = timeStamp;

    gameManager.update(deltaTime);
    gameManager.gameColision();
    gameManager.draw();

    requestAnimationFrame(gameLoop);
}