export class Box
{
    constructor(canvas,context)
    {
        this.canvas = canvas;
        this.context = context;
        this.rightBox = this.canvas.width / 2 + 300;
        this.leftBox = this.canvas.width / 2 - 300;
        this.bottomBox = this.canvas.height - 200;
        this.topBox = this.bottomBox - 500;
    }


    renderBox()
    {
        this.context.beginPath();
        this.context.fillStyle = 'rgba(235,233,155,0.2)';
        this.context.fillRect(this.leftBox, this.topBox, this.rightBox - this.leftBox, this.bottomBox - this.topBox);
        this.context.beginPath();
        this.context.lineWidth = 10;
        this.context.strokeStyle = 'black';
        this.context.moveTo(this.leftBox, this.bottomBox);
        this.context.lineTo(this.rightBox, this.bottomBox);
        this.context.stroke();
    }

    

}