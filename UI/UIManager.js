import { UIGameRenderer } from "./UIGameRenderer.js";
import { Button } from "./Button.js";
import { InputHandler } from "../Utils/InputHandler.js";
import { UIMainMenu } from "./UIMainMenu.js";
import { UiInGame } from "./UIInGame.js"
import { PauseGame } from "./UIPauseGame.js";
import { UiWin } from "./UIWin.js";
import { UILose } from "./UILose.js";
import { UIChoseLevel } from "./UIChoseLevel.js";
import LevelManager from "../Utils/LevelManager.js";

import { UIPlayerRecord } from "./UIPlayerRecord.js";
import SoundManager from "../SoundManager.js";
export class UIManager {
    static UIState =
        {
            mainmenu: 0,
            ingame: 1,
            pausegame: 2,
            wingame: 3,
            losegame: 4,
            choselevel:5,
            showrecord:6,
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
        this.uiChoseLevel = new UIChoseLevel(this);
        this.uiPlayerRecord = new UIPlayerRecord(this);

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
                    case 1:
                        this.ChoseLevel();
                        break;
                    case 2:
                        this.ShowRecordPlayer();
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
                        this.RestartGame();
                        break;
                    case 2:
                        this.BackToMainMenu();
                        break;
                }
                break;
            case UIManager.UIState.wingame:
                switch (this.uiWin.event(pos)) {
                    case 0:
                        this.RestartGame();
                        break;
                    case 1:
                        this.BackToMainMenu();
                        break;
                }
                break;
            case UIManager.UIState.losegame:
                switch (this.uiWin.event(pos)) {
                    case 0:
                        this.RestartGame();
                        break;
                    case 1:
                        this.BackToMainMenu();
                        break;
                }
                break;
            case UIManager.UIState.choselevel:
                switch(this.uiChoseLevel.event(pos))
                {
                    case 0:
                     
                        this.EasyLevel();
                        break;
                    case 1:
                       
                        this.MediumLevel();
                        break;
                    case 2:
                      
                        this.HardLevel();
                        break;
                }
                break;
            case UIManager.UIState.showrecord:
                switch(this.uiPlayerRecord.event(pos))
                {
                    case 0:
                        this.BackToMainMenu();
                        break;
                }
                break;
               
        }
    }


    StartGame() {
       this.gameManager.PlayGame(LevelManager.LevelType.easy);
       this.gameState = UIManager.UIState.ingame;
    }


    RestartGame()
    {
        this.gameManager.ResetGame();
        this.gameState = UIManager.UIState.ingame;
    }


    ShowRecordPlayer()
    {
        this.gameState = UIManager.UIState.showrecord;
        this.uiPlayerRecord.setRecord();
    }

    EasyLevel()
    {
        this.gameManager.PlayGame(LevelManager.LevelType.easy);
        this.gameState = UIManager.UIState.ingame;
    }
    MediumLevel()
    {
        this.gameManager.PlayGame(LevelManager.LevelType.medium);
        this.gameState = UIManager.UIState.ingame;
    }
    HardLevel()
    {
        this.gameManager.PlayGame(LevelManager.LevelType.hard);
        this.gameState = UIManager.UIState.ingame;
    }


    ChoseLevel()
    {
        this.gameState = UIManager.UIState.choselevel;
    }

    PauseGame() {
        this.gameManager.isPause = true;
        this.gameState = UIManager.UIState.pausegame;
    }
    ContinueGame() {
        this.gameManager.isPause = false;
        this.gameState = UIManager.UIState.ingame;
    }
    BackToMainMenu() {
        this.gameManager.isgameActive = false;
        this.gameState = UIManager.UIState.mainmenu;
    }

    ActionWin(score,time)
    {
        SoundManager.PlaySound('wingame'); // ActiveSound
        this.uiWin.setParameter(score,time);
        this.gameState = UIManager.UIState.wingame;
    }
    ActionLose(score)
    {
        SoundManager.PlaySound('losegame'); // Active sound
        this.uiLose.setParameter(score);
        this.gameState = UIManager.UIState.losegame;
    }
}