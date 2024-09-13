import { UIManager } from "./UIManager.js";

export class UIGameRenderer
{
    constructor( uimanager,context, canvas, type, )
    {
        this.uimanager = uimanager;
        this.context = context;
        this.canvas = canvas;
        this.type = type;
    }

    


    render(gameState)
    {

        //this.clear();
        switch(gameState)
        {
            case UIManager.UIState.mainmenu:
                this.clear();
                this.drawUIMainMenu();
                
                break;
            case UIManager.UIState.ingame:
                this.drawUIInGame();
                break
            case UIManager.UIState.pausegame:
                this.drawUIPauseGame();
                break;
            case UIManager.UIState.wingame:
               
                this.clear();
                this.drawUIWinGame();
                break;
            case UIManager.UIState.choselevel:
                this.clear();
                this.drawUiChoseLevel();
                break;
            case UIManager.UIState.losegame:
                this.clear();
                this.drawUiLoseGame();
                break;
            case UIManager.UIState.showrecord:
                this.clear();
                this.drawUIPlayerRecord();
                break;
        }
        
    }

    clear()
    {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    }

    drawUIMainMenu()
    {
       
        this.uimanager.mainMenu.render();
    }

    drawUIInGame()
    {
        this.uimanager.ingame.render();
    }

    drawUIPauseGame()
    {
        this.uimanager.uiPauseGame.render();
    }
    drawUIWinGame()
    {
        this.uimanager.uiWin.render();
    }


    drawUiLoseGame()
    {
        this.uimanager.uiLose.render();
    }

    drawUiChoseLevel()
    {
        this.uimanager.uiChoseLevel.render();
    }

    drawUIPlayerRecord()
    {
        this.uimanager.uiPlayerRecord.render();
    }

    

}