import { GameObject } from "./GameObject.js";
export class TextScore extends GameObject {
    constructor() {
        super();
        this.text = '';
        this.alpha = 1;
    }

    init(context,x,y,text)
    {
        super.init(context,x,y,0,-50);
        this.text = text;
        this.alpha = 1;
      
    }

    draw() {
        if(!this.isActive) return;
        this.context.save()
        this.context.beginPath();
        this.context.globalAlpha = this.alpha
        this.context.fillStyle =  ['red', 'blue', 'yellow', 'black', 'white'][Math.floor(Math.random() * 5)];
        this.context.font = 'bold 30px Verdana';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        this.context.fillText(`${this.text}`, this.x, this.y);
        this.context.restore()
    }

    update(deltatime) {
        this.y+= this.vy * deltatime;
        this.alpha -= 0.01;
        if(this.alpha < 0)
        {
            this.isActive = false;
        }
    }

    

}