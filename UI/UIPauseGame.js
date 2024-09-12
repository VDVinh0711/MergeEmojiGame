
import { Button } from "./Button.js";
export class PauseGame
{
    constructor(uimanager)
    {
        this.context = uimanager.context;
        this.canvas = uimanager.canvas;
        this.uimanager = uimanager;
        this.buttons = [];


        this.background = new Image();
        this.background.onload = () =>
        {
        }
        this.background.src = './Asset/Background/pauseBK.jpg';
        this.init();
    }


    init()
    {
        
        let btnResume = new Button(this.canvas.width/2 -100,this.canvas.height/2 - 50,200,100 ,'black',0,'Continue','white', 'italic bold 25px Verdana');
        let btnExit = new Button(this.canvas.width/2 -100,this.canvas.height/2 + 100,200,100 ,'black',1,'Exit','white', 'italic bold 25px Verdana');
        this.buttons.push(btnResume);
        this.buttons.push(btnExit);
    }

    render()
    {
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(this.background,0,0,this.canvas.width,this.canvas.height);
        this.buttons.forEach(button =>
        {
            button.draw(this.context);
        }
        )
    }

    event(pos)
    {
        let result = '';
        this.buttons.forEach(button => {
            if(button.onclick(pos))
            {
                result = button.action;
            }
        });
       
        return result;
    }
}