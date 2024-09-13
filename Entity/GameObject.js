//Main GameObject
export class GameObject {
    constructor(context, x, y, vx, vy) {
        this.context = null;
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.isColiding = false;
        this.useGravity = true;
        this.isActive = false;
    }

    init(context, x, y, vx, vy)
    {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isActive = true;
    }

    reset()
    {
        this.isActive = false;
    }
}