import LevelManager from "../Utils/LevelManager.js";
import { Button } from "./Button.js";
import { Text } from "../Entity/Text.js";
export class UIPlayerRecord
{
    constructor(uimanager)
    {
        this.canvas =uimanager.canvas;
        this.context = uimanager.context;
        this.buttons = [];
        this.background = new Image();
        this.textRecords = [];
        this.background.src = './Asset/Background/bkmain2.jpg';
        this.init();
    }

    init()
    {   
        let  backMenu = new Button(this.canvas.width/2 -100,this.canvas.height - 200,200,100 ,'black',0,'Back Menu','white', 'italic bold 25px Verdana');
        this.buttons.push(backMenu);
    }

 
    //Làm ẩu đ tối về fix
    setRecord()
    {
        this.textRecords.length = 0;
        const space = 100;
        let posYStart = 200;
        for (let key in LevelManager.leveRecord) {
            let level = LevelManager.leveRecord[key];
            this.texttile = new Text(this.context, this.canvas.width/2 , posYStart , `${level.type} : ${level.besttime} S` ,'italic bold 35px Verdana' , 'black');
            this.textRecords.push(this.texttile);
            posYStart +=space;
        }
    }
   
    render()
    {
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(this.background,0,0,this.canvas.width,this.canvas.height);

        this.textRecords.forEach(text => {
            text.draw();
        });
        

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
        console.log(result);
        return result;
    }
}