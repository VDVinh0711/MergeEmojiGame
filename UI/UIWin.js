import { Button } from "./Button.js";
import {Text} from "../Entity/Text.js";
export class UiWin
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


        this.background.src = './Asset/Background/bkWin.jpg';

        this.texttile = new Text(this.context, this.canvas.width/2 , 200 , 'Win' ,'italic bold 60px Verdana' , 'yellow');
        this.textScore = new Text(this.context, this.canvas.width/2 , 300 , `Score : ${this.score}` ,'italic bold 35px Verdana' , 'yellow');
        this.textTime = new Text(this.context, this.canvas.width/2 , 400 , `Time : ${this.time}` ,'italic bold 35px Verdana' , 'yellow');

        let btnplay = new Button(this.canvas.width/2 -100,this.canvas.height/2 - 50,200,100 ,'black',0,'Play Again','white', 'italic bold 25px Verdana');
        let btnExit = new Button(this.canvas.width/2 -100,this.canvas.height/2 + 100,200,100 ,'black',1,'Exit','white', 'italic bold 25px Verdana');
        this.buttons.push(btnplay);
        this.buttons.push(btnExit);
    }

    setParameter(score,time)
    {
        this.textScore.text = `Score : ${score}`;
        this.textTime.text = `Time : ${time}`;
    }
    render()
    {

        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(this.background,0,0,this.canvas.width,this.canvas.height);

       
        this.texttile.draw();
        this.textScore.draw();
        this.textTime.draw();

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