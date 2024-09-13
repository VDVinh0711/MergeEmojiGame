import { GameObject } from "./GameObject.js";
export class Particle extends GameObject {
    constructor() {
        super()
        this.radius = 0;
        this.color = null;
        this.alpha = 1;
    }

    init(context,x,y,radius,color,vx,vy)
    {
        super.init(context,x,y,vx,vy);
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.vx = vx;
        this.vy = vy;
        this.context = context;
        this.alpha = 1;
    }

    draw() {
        if(!this.isActive) return;
        this.context.save()
        this.context.globalAlpha = this.alpha
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color
        this.context.fill()
        this.context.restore()
    }

    update(deltatime) {
        if(!this.isActive) return;
        this.x += this.vx * deltatime;
        this.y += this.vy * deltatime;
        this.alpha -= 0.02;
        if(this.alpha< 0)
        {
            this.isActive = false;
        }
    }
}