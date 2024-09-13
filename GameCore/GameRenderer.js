export class GameRenderer {
    constructor(gammanager) {
        this.gammanager = gammanager;
        this.context = gammanager.context;
        this.canvas = gammanager.canvas;
    }

    render() {
        this.clear()
        this.drawFps();
        this.drawBackground();
        this.drawZoneSpawm();
        // this.drawFps();
        this.drawBox();
        this.drawGameObject();
        this.drawParticles();
        this.drawWayPoint();
        this.drawTextScores();
        this.drawPlayerScore();
        this.drawCurrentLevel();
        this.drawTimeInGame();
        this.drawUserGuide();
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawFps() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.fillText(`FPS:${this.gammanager.fps}`, 0, 0);
        this.context.font = '20px Arial';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
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
        this.context.strokeStyle = 'red';
        this.context.moveTo(this.gammanager.leftBox, this.gammanager.topBox);
        this.context.lineTo(this.gammanager.rightBox, this.gammanager.topBox);
        this.context.stroke();
    }

    drawBox() {

        // let sprite = new Image();
        // sprite.src = './Asset/Background/boxv2.jpg';
        // this.context.imageSmoothingEnabled = true;
        // this.context.imageSmoothingQuality = 'high';
        // this.context.beginPath();
        // this.context.drawImage(sprite, this.gammanager.leftBox, this.gammanager.topBox, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.bottomBox - this.gammanager.topBox);



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

    drawPlayerScore() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = 'bold 21px Tahoma';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Score : ${this.gammanager.playerScore}`, 20, 40);
    }

    drawCurrentLevel() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.fillText(`Level : ${this.gammanager.currentLevel}`, 20, 10);
        this.context.font = 'bold 21px Tahoma';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
    }

    drawTimeInGame() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = 'bold 24px Tahoma';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Time : ${this, this.gammanager.timeInGame}`, this.canvas.width / 2 - 100, 10);
    }

    drawUserGuide() {

        this.gammanager.userGuide.render();
    }
    drawGameObject() {

        this.gammanager.poolingEmojis.activeObjs.forEach(gameobj => {
            gameobj.draw();
        });
    }

    drawParticles() {
      //  this.gammanager.poolingParticles.draw();
      this.gammanager.particles.render();
    }

    drawWayPoint() {
        this.gammanager.wayPoints.render();
    }

    drawTextScores() {
       // this.gammanager.poolingTextScore.draw();
       this.gammanager.scorePopup.render();
    }
}