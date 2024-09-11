

//Main GameObject
class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColiding = false;
        this.useGravity = true;
    }
}


//Fruit
export class Emoji extends GameObject {
    constructor(context, x, y, vx, vy, radius, type, srcIMG) {
        super(context, x, y, vx, vy);
        this.radius = radius;
        this.mass = 70;
        this.type = type;
        this.srcIMG = srcIMG;
        this.canCheckLose = false;
        this.canMerge = false;
        this.sprite = new Image();
        this.sprite.onload = () => {
        }
        this.sprite.src = this.srcIMG;
        this.angle = -90;
    }

    draw() {


        // this.context.beginPath();
        // this.context.lineWidth = 2;
        // this.context.strokeStyle = this.color;
        // this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // this.context.stroke();


        // const scale = Math.min(this.radius * 2 / this.sprite.width,
        //     this.radius * 2 / this.sprite.height);

        // const scaledWidth = this.sprite.width * scale;
        // const scaledHeight = this.sprite.height * scale;

        // this.context.imageSmoothingEnabled = true;
        // this.context.imageSmoothingQuality = 'high';





        // // Vẽ ảnh
        // const x = this.x - scaledWidth / 2;
        // const y = this.y - scaledHeight / 2;
        // this.context.drawImage(this.sprite, x, y, scaledWidth, scaledHeight);
        this.context.save();
        this.context.beginPath();



        // this.context.beginPath();
        // this.context.lineWidth = 2;
        // this.context.strokeStyle = 'red';
        // this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // this.context.stroke();


        this.context.translate(this.x, this.y);
        this.context.rotate(Math.PI / 180 * (this.angle + 90));
        this.context.translate(-this.x, -this.y);

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

    updateCanMerge(topBox) {
        if (this.y > topBox) {
            this.canMerge = true;
            this.canCheckLose = true;
        }
    }
    update(deltatime) {
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













