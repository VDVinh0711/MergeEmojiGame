export class Text {
    constructor(context, x, y, text, font = '16px Arial', color = 'black',textAlign  = 'center' , textBaseline = 'middle') {
        this.context = context;
        this.x = x;
        this.y = y;
        this.text = text;
        this.font = font;
        this.color = color;
        this.textAlign = textAlign;
        this.textBaseline = textBaseline;
    }

    draw() {
     
        this.context.font = this.font;
        this.context.fillStyle = this.color;
        this.context.textAlign = this.textAlign;
        this.context.textBaseline = this.textBaseline;
        this.context.fillText(this.text, this.x, this.y);
    }
}
