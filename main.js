import { GameManager } from './GameCore/GameManger.js';
import { UIManager } from './UI/UI_Manager.js';





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
    requestAnimationFrame(gameLoop);
   
}

function gameLoop(timeStamp) {

    deltaTime = (timeStamp - oldTimeStamp) / 1000;
    deltaTime = Math.min(deltaTime, 0.1);
    oldTimeStamp = timeStamp;

    gameManager.update(deltaTime);
    gameManager.render();


    uiManager.draw();
    requestAnimationFrame(gameLoop);
}


