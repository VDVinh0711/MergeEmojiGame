export class Text {
    constructor(context, x, y, text, font = '16px Arial', color = 'black' ) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.text = text;
        this.font = font;
        this.color = color;
    }

    draw() {
     
        this.context.font = this.font;
        this.context.fillStyle = this.color;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.fillText(this.text, this.x, this.y);
    }
}
