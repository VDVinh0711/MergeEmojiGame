

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
    constructor(context, x, y, vx, vy, radius, type, color) {
        super(context, x, y, vx, vy);
        this.radius = radius;
        this.mass = 70;
        this.type = type;
        this.color = color;
        this.canCheckLose = false;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = this.color;
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fill();


        this.context.translate(this.x, this.y);
        this.context.rotate(Math.PI / 180 * (this.angle + 90));
        this.context.translate(-this.x, -this.y);
        this.context.setTransform(1, 0, 0, 1, 0, 0);
    }

    //Update Changr radius , type, color
    updateFruit(radius, type, color) {
        this.radius = radius;
        this.type = type;
        this.color = color;
    }


    
    update(deltatime) {
        this.x += this.vx * deltatime;
        this.y += this.vy * deltatime;
        this.handelGravity(deltatime);
        this.rotate(deltatime);
    }


    handelGravity(deltatime) {
        if (!this.useGravity) return;
        this.vy += 9.8 * this.mass * deltatime ;

    }

    handelColison()
    {
        this.canCheckLose = true;
        this.isColiding = true;
    }

    rotate(deltatime) {
        let radians = Math.atan2(this.vy * deltatime, this.vx * deltatime);
        this.angle = (180 * radians / Math.PI);
    }

    updateV(speed,massOther, dis) {
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
        this.radius = 5;
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
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
  constructor( context,x, y, radius, color, vx,vy) {
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
    this.x +=  this.vx * deltatime;
    this.y +=  this.vy * deltatime;
    this.alpha -= 0.02;
  }
}


class TextScore
{
    constructor( context,x,y,text)
    {
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

    update(deltatime)
    {
        this.alpha -= 0.01;
    }

}