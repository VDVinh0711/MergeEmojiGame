import LevelManager from "../Utils/LevelManager.js";
import { Button } from "../Entity/Button.js";

export class UiInGame
{
    constructor(uimanager,gamemanager)
    {
        this.canvas =uimanager.canvas;
        this.context = uimanager.context;
        this.gamemanager = gamemanager;
        this.uimanager = uimanager;
        this.buttons = [];
        this.init();
    }
    init()
    {
        const buttonPause =new Button(this.canvas.width - 120,0,120,50 ,'gray',0,'Pause','white', 'italic bold 20px Verdana');
        this.buttons.push(buttonPause);
    }


    event(pos)
    {
        let result = '';
        this.buttons.forEach(button =>
        {
            if(button.onclick(pos))
            {
                result  = button.action;
            }
        }
        )
        return result;
    }

    render()
    {

        this.buttons.forEach(button =>
            {
                button.draw(this.context);
            })

        this.drawPlayerScore();
        this.drawCurrentLevel();
        this.drawTimeInGame();
    }


    drawPlayerScore() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = 'bold 21px Tahoma';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Score : ${this.gamemanager.playerScore.getScore()}`, 20, 40);
    }

    drawCurrentLevel() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.fillText(`Level : ${LevelManager.currentLevel}`, 20, 10);
        this.context.font = 'bold 21px Tahoma';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
    }

    drawTimeInGame() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = 'bold 24px Tahoma';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Time : ${this, this.gamemanager.timeManager.time}`, this.canvas.width / 2 - 100, 10);
    } 

}