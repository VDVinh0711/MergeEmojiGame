import { Dot } from '../Entity/Dot.js';
export class Waypoint
{
    constructor(context)
    {
        this.points = [];
        this.context = context;
    }
    createPoints(pos)
    {
        const spaceSize = 30;
        let posBegin =
        {
            x: pos.x,
            y: pos.y
        }
        for (let i = 0; i < 5; i++) {
            const newDot = new Dot(this.context, posBegin.x, posBegin.y);
            this.points.push(newDot);
            posBegin.y += spaceSize;
        }
    }
    render()
    {
        this.points.forEach(dot => {
            dot.draw();
        });
    }
    clear()
    {
        this.points = [];
    }
}