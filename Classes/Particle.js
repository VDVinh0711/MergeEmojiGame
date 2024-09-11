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


    static createParticels(context, posX, posY) {
        for (let i = 0; i < 50; i++) {
            Particle.listParticles.push(
                new Particle(context, posX, posY,
                    Math.floor(Math.random() * (15 - 10 + 1)) + 10,
                    'yellow',
                    (Math.random() - 0.5) * (Math.random() * 6) * 100,
                    (Math.random() - 0.5) * (Math.random() * 6) * 100
                )
            )
        }
    }
    static drawListParticles() {
        Particle.listParticles.forEach(particle => {
            particle.draw();
        }
        )
    }
    static updateListParticles(deltatime) {
        Particle.listParticles.forEach((particle, index) => {
            if (particle.alpha <= 0) {
                Particle.listParticles.splice(index, 1)
            } else {
                particle.update(deltatime)
            }
        });
    }
}