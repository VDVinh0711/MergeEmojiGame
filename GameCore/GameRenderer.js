export class GameRenderer {
    constructor(gammanager) {
        this.gammanager = gammanager;
        this.context = gammanager.context;
        this.canvas = gammanager.canvas;
    }

    render() {
        this.clear()
        this.drawBackground();
        this.drawZoneSpawm();
        this.drawBox();
        this.drawGameObject();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground() {
        this.context.beginPath();
        let sprite = new Image();
        sprite.src = './Asset/Background/ingame.jpg';
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(sprite, 0, 0, this.canvas.width, this.canvas.height);
    }

    drawZoneSpawm() {
        this.context.beginPath();
        this.context.lineWidth = 20;
        this.context.strokeStyle =   this.gammanager.collisionManager.isCollidingWithBoundary?  'red' : 'green' ;
        this.context.moveTo(this.gammanager.leftBox, this.gammanager.topBox);
        this.context.lineTo(this.gammanager.rightBox, this.gammanager.topBox);
        this.context.stroke();
    }

    drawBox() {
        this.context.beginPath();
        this.context.fillStyle = 'rgba(235,233,155,0.5)';
        this.context.fillRect(this.gammanager.leftBox, this.gammanager.topBox, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.bottomBox - this.gammanager.topBox);
        this.context.beginPath();
        this.context.lineWidth = 10;
        this.context.strokeStyle = 'black';
        this.context.moveTo(this.gammanager.leftBox, this.gammanager.bottomBox);
        this.context.lineTo(this.gammanager.rightBox, this.gammanager.bottomBox);
        this.context.stroke();
    }

    drawGameObject() {

        this.gammanager.poolingEmojis.activeObjs.forEach(gameobj => {
            gameobj.draw();
        });
    }
}