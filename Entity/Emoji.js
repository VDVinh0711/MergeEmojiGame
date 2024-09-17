

import { GameObject } from "./GameObject.js";


//Fruit
export class Emoji extends GameObject {
    constructor()
    {
        super();
        this.canCheckLose = false;
        this.canMerge = false;
        this.sprite = new Image();
        this.sprite.src  = '';
        this.angle = -90;
        this.radius = 0;
        this.mass = 0;
        this.type = null;
    }

    init(context, x, y, vx, vy, radius, type, srcIMG)
    {
        super.init(context,x,y,vx,vy);
        this.radius = radius;
        this.type = type;
        this.mass = 70;
        this.sprite.src = srcIMG;
        this.canCheckLose = false;
        this.canMerge = false;
    }
    draw() {

        
        this.context.save();
        this.context.beginPath();

        this.context.translate(this.x, this.y);
        this.context.rotate(Math.PI / 180 * (this.angle + 90));
        this.context.translate(-this.x, -this.y);


        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';

        this.context.drawImage(this.sprite,
            this.x - this.radius,
            (this.y - this.radius),
            this.radius * 2,
            this.radius * 2.12);
        this.context.restore();
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    //Update Changr radius , type, color
    updateModelEmoji(radius, type, srcIMG) {
        this.radius = radius;
        this.type = type;
        this.sprite.src = srcIMG;
    }

    updateState(topBox) {
        if (this.y + this.radius/2  > topBox) {
            this.canMerge = true;
            this.canCheckLose = true;
        }
    }
    update(deltatime) {
        //if(!this.isActive) return;
        this.x += this.vx * deltatime;
        this.y += this.vy * deltatime;
        this.handleGravity(deltatime);
        this.rotate(deltatime);
    }

    handleGravity(deltatime) {
        if (!this.useGravity) return;
        this.vy += 9.8 * this.mass * deltatime;
    }

    handleColison() {
        this.isColiding = true;
      
    }
    rotate(deltatime) {
        let targetAngle = Math.atan2(this.vy, this.vx) * 180 / Math.PI;
        targetAngle = (targetAngle + 360) % 360;
        let angleDiff = targetAngle - this.angle;
        if (angleDiff > 180) {
            angleDiff -= 360;
        } else if (angleDiff < -180) {
            angleDiff += 360;
        }
        const rotationSpeed = 5;
        this.angle += angleDiff * rotationSpeed * deltatime;
        this.angle = (this.angle + 360) % 360;
    }

    CheckColision(other) {
        let alphaX = other.x - this.x;
        let alphaY = other.y - this.y;
        let distance = Math.sqrt((alphaX * alphaX) + (alphaY * alphaY));
        let len = this.radius + other.radius;
        return distance <= len;
    }
   


}













