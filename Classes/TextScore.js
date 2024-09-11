export class TextScore {
    constructor(context, x, y, text) {
        this.x = x,
            this.context = context;
        this.y = y,
            this.text = text;
        this.alpha = 1;
    }


    draw() {
        this.context.save()
        this.context.beginPath();
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