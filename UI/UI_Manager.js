import { UIGameRenderer } from "./UI_GameRenderer.js";
import { Button } from "../Entity/Button.js";
import { InputHandler } from "../Utils/InputHandler.js";
import { UIMainMenu } from "./UI_MainMenu.js";
import { UiInGame } from "./UI_InGame.js"
import { PauseGame } from "./UI_PauseGame.js";
import { UiWin } from "./UI_Win.js";
import { UILose } from "./UI_Lose.js";
import { UIChoseLevel } from "./UI_ChoseLevel.js";
import LevelManager from "../Utils/LevelManager.js";

import { UIPlayerRecord } from "./UI_PlayerRecord.js";
import SoundManager from "../Utils/SoundManager.js";
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
        this.ingame = new UiInGame(this,gameManager);
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
        this.gameManager.on('win', this.OnActionWin.bind(this));
        this.gameManager.on('lose', this.OnActionLose.bind(this));
    }

    draw() {
        this.uiRenderer.render(this.gameState);
    }




    handleOnClick(pos) {

        switch (this.gameState) {
            case UIManager.UIState.mainmenu:
                switch (this.mainMenu.event(pos)) {
                    case 0:
                        this.OnButtonStartGameClick();
                        break;
                    case 1:
                        this.OnChoseLevel();
                        break;
                    case 2:
                        this.OnButtonShowRecordPlayerClick();
                        break;

                }
                break;
            case UIManager.UIState.ingame:
                switch (this.ingame.event(pos)) {
                    case 0:
                        this.OnButtonPauseClick();
                        break;
                }
                break;
            case UIManager.UIState.pausegame:
                console.log(this.uiPauseGame.event(pos));
                switch (this.uiPauseGame.event(pos)) {
                    case 0:
                        this.OnButtonContinueClick();
                        break;
                    case 1:
                        this.OnButtonRestartGameClick();
                        break;
                    case 2:
                        this.OnButtonBackToMainMenuClick();
                        break;
                }
                break;
            case UIManager.UIState.wingame:
                switch (this.uiWin.event(pos)) {
                    case 0:
                        this.OnButtonRestartGameClick();
                        break;
                    case 1:
                        this.OnButtonBackToMainMenuClick();
                        break;
                }
                break;
            case UIManager.UIState.losegame:
                switch (this.uiWin.event(pos)) {
                    case 0:
                        this.OnButtonRestartGameClick();
                        break;
                    case 1:
                        this.OnButtonBackToMainMenuClick();
                        break;
                }
                break;
            case UIManager.UIState.choselevel:
                switch(this.uiChoseLevel.event(pos))
                {
                    case 0:
                     
                        this.OnButtonEasyLevelClick();
                        break;
                    case 1:
                       
                        this.OnButtonMediumLevelClick();
                        break;
                    case 2:
                      
                        this.OnButtonHardLevelClick();
                        break;
                }
                break;
            case UIManager.UIState.showrecord:
                switch(this.uiPlayerRecord.event(pos))
                {
                    case 0:
                        this.OnButtonBackToMainMenuClick();
                        break;
                }
                break;
               
        }
    }


    OnButtonStartGameClick() {
       this.gameManager.PlayGame(LevelManager.LevelType.EASY);
       this.gameState = UIManager.UIState.ingame;
       SoundManager.PlaySoundBackGround('background');
     
    }


    OnButtonRestartGameClick()
    {
        this.gameManager.ResetGame();
        this.gameState = UIManager.UIState.ingame;
    }


    OnButtonShowRecordPlayerClick()
    {
        this.gameState = UIManager.UIState.showrecord;
        this.uiPlayerRecord.setRecord();
    }

    OnButtonEasyLevelClick()
    {
        this.gameManager.PlayGame(LevelManager.LevelType.EASY);
        console.log(LevelManager.LevelType.EASY);
        this.gameState = UIManager.UIState.ingame;
    }
    OnButtonMediumLevelClick()
    {
        this.gameManager.PlayGame(LevelManager.LevelType.MEDIUM);
        this.gameState = UIManager.UIState.ingame;
    }
    OnButtonHardLevelClick()
    {
        this.gameManager.PlayGame(LevelManager.LevelType.HARD);
        this.gameState = UIManager.UIState.ingame;
    }


    OnChoseLevel()
    {
        this.gameState = UIManager.UIState.choselevel;
    }

    OnButtonPauseClick() {
        this.gameManager.isPause = true;
        this.gameState = UIManager.UIState.pausegame;
    }
    OnButtonContinueClick() {
        this.gameManager.isPause = false;
        this.gameState = UIManager.UIState.ingame;
    }
    OnButtonBackToMainMenuClick() {
        this.gameManager.isgameActive = false;
        this.gameState = UIManager.UIState.mainmenu;
    }

 


    OnActionWin({ score, time }) {
        SoundManager.PlaySoundSFX('wingame');
        this.uiWin.setParameter(score, time);
        this.gameState = UIManager.UIState.wingame;
    }
    OnActionLose({score})
    {
        SoundManager.PlaySoundSFX('losegame'); // Active sound
        this.uiLose.setParameter(score);
        this.gameState = UIManager.UIState.losegame;
    }
}