import { GameManager } from './GameCore/GameManger.js';
import { UIManager } from './UI/UIManager.js';





let gameManager;
let uiManager;
let deltaTime = 0; // aka delta time
let oldTimeStamp = 0;

window.onload = init();

function init() {
    gameManager = new GameManager();
    gameManager.isGameActive = false;
    uiManager = new UIManager(gameManager);
    uiManager.init();
    gameManager.addUIManger(uiManager);
    requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {

    deltaTime = (timeStamp - oldTimeStamp) / 1000;
    deltaTime = Math.min(deltaTime, 0.1);
    oldTimeStamp = timeStamp;

    gameManager.update(deltaTime);
    gameManager.gameColision();
    gameManager.draw();


    uiManager.draw();
    requestAnimationFrame(gameLoop);
}


