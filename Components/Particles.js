import { ObjectPooling } from "../DesignPattern/ObjectPooling.js";
import { Particle } from "../Entity/Particle.js";
export class Particles 
{
    constructor(context,color)
    {
        this.context = context;
        this.color  = color;
        this.poolingParticles = new ObjectPooling(this.context, Particle, 100);
    }

    spawm(x,y)
    {
        for (let i = 0; i < 50; i++) {
            const particle = this.poolingParticles.get();
            particle.init(
                this.context, x, y,
                Math.floor(Math.random() * (15 - 10 + 1)) + 10,
                this.color,
                (Math.random() - 0.5) * (Math.random() * 6) * 100,
                (Math.random() - 0.5) * (Math.random() * 6) * 100
            )
        }
    }

    update(deltatime)
    {
        this.poolingParticles.update(deltatime);
    }

    render()
    {
        this.poolingParticles.draw();
    }

    clear()
    {
        this.poolingParticles.reset();
    }
}