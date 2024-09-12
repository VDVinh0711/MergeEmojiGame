import { Button } from "./Button.js";
import {Text} from "../Classes/Text.js";
export class UILose
{
    constructor(uimanager)
    {
        this.context = uimanager.context;
        this.canvas = uimanager.canvas;
        this.uimanager = uimanager;
        this.buttons = [];
        this.texts = [];
        this.init();
    }

    init()
    {
        let btnplay = new Button(this.canvas.width/2 -100,this.canvas.height/2 - 50,200,100 ,'black',0,'Play Again','white', 'italic bold 25px Verdana');
        let btnExit = new Button(this.canvas.width/2 -100,this.canvas.height/2 + 100,200,100 ,'black',1,'Exit','white', 'italic bold 25px Verdana');
        this.buttons.push(btnplay);
        this.buttons.push(btnExit);


        

    }

    setParameter(score)
    {

        this.score = score;
        this.time = time;
        let texttile = new Text(this.context, this.canvas.width/2 , 200 , 'LOSE' ,'italic bold 60px Verdana' , 'yellow');
        let textScore = new Text(this.context, this.canvas.width/2 , 300 , `Score : ${this.score}` ,'italic bold 35px Verdana' , 'yellow');
        
        this.texts.push(texttile);
        this.texts.push(textScore);
    }
    render()
    {

        this.texts.forEach(text => {
            text.draw();
        });
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