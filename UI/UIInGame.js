import { Button } from "./Button.js";

export class UiInGame
{
    constructor(uimanager)
    {
        this.canvas =uimanager.canvas;
        this.context = uimanager.context;
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
            }
            )
    }

}