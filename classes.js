

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
class Fruit extends GameObject {
    static sprite;
    static scaleImageWidth;
    static scaleImageHeight;
    constructor(context, x, y, vx, vy, radius, type, srcIMG) {
        super(context, x, y, vx, vy);
        this.radius = radius;
        this.mass = 70;
        this.type = type;
        this.srcIMG = srcIMG;
        this.canCheckLose = false;
        this.sprite = new Image();

        this.sprite.onload = () => {
        }
        this.sprite.src = this.srcIMG;
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



        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'red';
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.stroke();


        this.context.drawImage(this.sprite, this.x - this.radius ,(this.y - this.radius), this.radius*2, this.radius*2.12);



        // this.context.translate(this.x, this.y);
        // this.context.rotate(Math.PI / 180 * (this.angle + 90));
        // this.context.translate(-this.x, -this.y);


        

        this.context.restore();


      


        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    //Update Changr radius , type, color
    updateFruit(radius, type, srcIMG) {
        this.radius = radius;
        this.type = type;
        this.sprite.src = srcIMG;
    }







    update(deltatime) {
        this.x += this.vx * deltatime;
        this.y += this.vy * deltatime;
        this.handelGravity(deltatime);
        this.rotate(deltatime);
    }


    handelGravity(deltatime) {
        if (!this.useGravity) return;
        this.vy += 9.8 * this.mass * deltatime;

    }

    handelColison() {
        this.canCheckLose = true;
        this.isColiding = true;
    }

    rotate(deltatime) {
        let radians = Math.atan2(this.vy * deltatime, this.vx * deltatime);
        this.angle = (180 * radians / Math.PI)
    }

    updateV(speed, massOther, dis) {
        if (speed < 0) {
            return;
        }

        let impulse = 2 * speed / (this.mass + massOther);
        this.vx += dis * (speed * this.vColisionNor.x);
        this.vy += dis * (speed * this.vColisionNor.y);
    }


    CheckColision(other) {
        let alphaX = other.x - this.x;
        let alphaY = other.y - this.y;
        let distance = Math.sqrt((alphaX * alphaX) + (alphaY * alphaY));
        let len = this.radius + other.radius;
        this.vColisionNor = {
            x: alphaX / distance,
            y: alphaY / distance
        }
        other.vColisionNor = this.vColisionNor;
        return distance <= len;
    }


}









class Dot {
    constructor(context, x, y) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.radius = 2;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = 'gray';
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fill();
    }
    update(x, y) {
        this.x += x;
        this.y += y;
    }
}





// Partical
class Particle {
    constructor(context, x, y, radius, color, vx, vy) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.vx = vx;
        this.vy = vy;
        this.alpha = 1
        this.context = context;
    }

    draw() {
        this.context.save()
        this.context.globalAlpha = this.alpha
        this.context.beginPath()
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        this.context.fillStyle = this.color
        this.context.fill()
        this.context.restore()
    }

    update(deltatime) {
        this.x += this.vx * deltatime;
        this.y += this.vy * deltatime;
        this.alpha -= 0.02;
    }
}


class TextScore {
    constructor(context, x, y, text) {
        this.x = x,
            this.context = context;
        this.y = y,
            this.text = text;
        this.alpha = 1;
    }


    draw() {
        this.context.save()
        context.beginPath();
        this.context.globalAlpha = this.alpha
        this.context.fillStyle = 'black';
        this.context.fillText(`${this.text}`, this.x, this.y);
        this.context.font = '20px Arial';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'top';
        this.context.restore()
    }

    update(deltatime) {
        this.alpha -= 0.01;
    }

}