import { UIGameRenderer } from "./UIGameRenderer.js";
import { Button } from "./Button.js";
import { InputHandler } from "../Utils/InputHandler.js";
import { UIMainMenu } from "./UIMainMenu.js";
import { UiInGame } from "./UIInGame.js"
import { PauseGame } from "./UIPauseGame.js";

import { UiWin } from "./UIWin.js";
import { UILose } from "./UILose.js";
export class UIManager {
    static UIState =
        {
            mainmenu: 0,
            ingame: 1,
            pausegame: 2,
            wingame: 3,
            losegame: 4
        }
    constructor(gameManager) {
        this.canvas = document.getElementById("mainview");
        this.context = this.canvas.getContext('2d');
        this.gameManager = gameManager;

        this.mainMenu = new UIMainMenu(this);
        this.ingame = new UiInGame(this);
        this.uiPauseGame = new PauseGame(this);
        this.uiWin = new UiWin(this);
        this.uiLose = new UILose(this);
        this.uiRenderer = new UIGameRenderer(this, this.context, this.canvas, 'mainMenu');
        this.inputHandle = new InputHandler(this.canvas, this.context);
        this.gameState = UIManager.UIState.mainmenu;
    }


    init() {
        this.inputHandle.on('mouseDown', this.handleOnClick.bind(this));
        this.gameManager.onActionWin = this.ActionWin;
        this.gameManager.onActionLose = this.ActionLose; 
    }

    draw() {
        this.uiRenderer.render(this.gameState);
    }




    handleOnClick(pos) {

        switch (this.gameState) {
            case UIManager.UIState.mainmenu:
                switch (this.mainMenu.event(pos)) {
                    case 0:
                        this.StartGame();
                        break;
                }
                break;
            case UIManager.UIState.ingame:
                switch (this.ingame.event(pos)) {
                    case 0:
                        console.log('run pause');
                        this.PauseGame();
                        break;
                }
                break;
            case UIManager.UIState.pausegame:
                console.log(this.uiPauseGame.event(pos));
                switch (this.uiPauseGame.event(pos)) {
                    case 0:
                        this.ContinueGame();
                        break;
                    case 1:
                        this.ExitGame();
                        break;
                }
                break;
            case UIManager.UIState.wingame:
                switch (this.uiWin.event(pos)) {
                    case 0:
                        this.StartGame();
                        break;
                    case 1:
                        this.ExitGame();
                        break;
                }
                break;
            case UIManager.UIState.losegame:
                switch (this.uiWin.event(pos)) {
                    case 0:
                        this.StartGame();
                        break;
                    case 1:
                        this.ExitGame();
                        break;
                }
                break;
        }
    }



    StartGame() {
        this.gameManager.isGameActive = true;
        this.gameManager.ResetGame();
        this.gameState = UIManager.UIState.ingame;
    }
    PauseGame() {
        this.gameManager.isPause = true;
        this.gameState = UIManager.UIState.pausegame;
    }
    ContinueGame() {
        this.gameManager.isPause = false;
        this.gameState = UIManager.UIState.ingame;
    }
    ExitGame() {
        this.gameManager.isgameActive = false;
        this.gameState = UIManager.UIState.mainmenu;
    }

    ActionWin(score,time)
    {
        console.log(`${score} == ${time}`);
        

        this.uiWin.setParameter(score,time);
        this.gameState = UIManager.UIState.wingame;
    }
    ActionLose(score)
    {
        this.uiLose.setParameter(score);
        this.gameState = UIManager.UIState.losegame;
    }
}