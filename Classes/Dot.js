
export class Dot {
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