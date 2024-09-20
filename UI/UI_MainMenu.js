import { Button } from "../Entity/Button.js";
export class UIMainMenu
{
    constructor(uimanager)
    {
        this.canvas =uimanager.canvas;
        this.context = uimanager.context;
        this.buttons = [];
        this.background = new Image();

        this.background.src = './Asset/Background/bkmain2.jpg';
        this.init();
    }

    init()
    {

        
        let  buttonPlay = new Button(this.canvas.width/2 -100,this.canvas.height/2 - 50,200,100 ,'black',0,'PlayGame','white', 'italic bold 25px Verdana');
        let  buttonChoseLevel = new Button(this.canvas.width/2 -100,this.canvas.height/2 + 100,200,100 ,'black',1,'Chose Level','white', 'italic bold 25px Verdana');
        let  btnShowRec = new Button(this.canvas.width/2 -100,this.canvas.height/2 + 250,200,100 ,'black',2,'Record','white', 'italic bold 25px Verdana');
        this.buttons.push(buttonPlay);
        this.buttons.push(buttonChoseLevel);
        this.buttons.push(btnShowRec);
    }

    render()
    {
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(this.background,0,0,this.canvas.width,this.canvas.height);
        this.buttons.forEach(button => {
            button.draw(this.context);
        });
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