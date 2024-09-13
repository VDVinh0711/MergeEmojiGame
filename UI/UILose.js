import { Button } from "./Button.js";
import {Text} from "../Entity/Text.js";
export class UILose
{
    constructor(uimanager)
    {
        this.context = uimanager.context;
        this.canvas = uimanager.canvas;
        this.uimanager = uimanager;
        this.buttons = [];
        this.background = new Image();
        this.init();
    }

    init()
    {

        this.background.src = './Asset/Background/bkLose.jpg';
        this.texttile = new Text(this.context, this.canvas.width/2 , 200 , 'LOSE' ,'italic bold 60px Verdana' , 'black');
        this.textScore = new Text(this.context, this.canvas.width/2 , 300 , `Score : 0` ,'italic bold 35px Verdana' , 'black');

        let btnplay = new Button(this.canvas.width/2 -100,this.canvas.height/2 - 50,200,100 ,'black',0,'Play Again','white', 'italic bold 25px Verdana');
        let btnExit = new Button(this.canvas.width/2 -100,this.canvas.height/2 + 100,200,100 ,'black',1,'Exit','white', 'italic bold 25px Verdana');
        this.buttons.push(btnplay);
        this.buttons.push(btnExit);
    }

    setParameter(score)
    {
        this.textScore.text = `Score ${score}`;
    }
    render()
    {

        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(this.background,0,0,this.canvas.width,this.canvas.height);

        this.texttile.draw();
        this.textScore.draw();
        this.buttons.forEach(button =>
        {
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