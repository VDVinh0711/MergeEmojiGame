export class Particle {
    static listParticles = [];
    constructor(context, x, y, radius, color, vx, vy) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.vx = vx;
        this.vy = vy;
        this.alpha = 1
        this.context = context;
        // console.log(this.x);
        // console.log(this.y);
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