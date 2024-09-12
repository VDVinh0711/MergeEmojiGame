
export class Button
{
    constructor(x,y, width, height, color,action,text = '', textcolor = 'black', textfont = '20px Arial')
    {
        this.x = x;
        this.y = y;
        this.width  = width;
        this.height =height;
        this.color = color;
        this.action = action;
        this.text  = text;
        this.textfont = textfont;
        this.textcolor = textcolor;
    }


    onclick(mousePos)
    {
        return mousePos.x >= this.x && mousePos.x <=this.width+ this.x &&
        mousePos.y >= this.y && mousePos.y <= this.y +this.height;
    }

    draw(context)
    {

        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
        // Draw text
        context.beginPath();
        context.fillStyle = this.textcolor;
        context.font = this.textfont;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(`${this.text}`, this.x +this.width/2, this.y+this.height/2);
    }


}