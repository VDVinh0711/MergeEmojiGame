import { Particle } from "../Classes/Particle.js";

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
        this.drawBestTimePlayer();
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
        this.context.drawImage(sprite,0,0,this.canvas.width,this.canvas.height);
        // this.context.fillStyle = 'pink';
        // this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        // this.context.fill();
    }

    drawZoneSpawm() {
        this.context.beginPath();
        this.context.lineWidth = 20;
        this.context.strokeStyle = 'red';
      //  this.context.rect(this.gammanager.leftBox, 0, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.topBox);
        this.context.moveTo(this.gammanager.leftBox,this.gammanager.topBox);
        this.context.lineTo(this.gammanager.rightBox, this.gammanager.topBox);
        this.context.stroke();
    }

    drawBox() {




       



        // this.context.beginPath();
        // this.context.fillStyle = 'white';
        // this.context.rect(this.gammanager.leftBox, this.gammanager.topBox, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.bottomBox - this.gammanager.topBox);
        // this.context.fill();


        let sprite = new Image();
        sprite.src = './Asset/Background/boxv2.jpg';

        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';
        this.context.beginPath();
        this.context.drawImage(sprite,this.gammanager.leftBox, this.gammanager.topBox, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.bottomBox - this.gammanager.topBox);


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

    drawBestTimePlayer() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.fillText(`Best Time : ${this.gammanager.bestTime}`, 20, 10);
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
        this.context.fillText(`Time : ${this, this.gammanager.timeInGame}`, this.canvas.width/2-100, 10);
    }



    drawUserGuide() {
        this.gammanager.userGuide.forEach(element => {
            element.draw();
           
        });
    }
    drawGameObject() {
        // this.gammanager.gameObjects.forEach(gameObject => {
        //     gameObject.draw();
        // });

        this.gammanager.poolingEmojis.activeObjs.forEach(gameobj => {
            gameobj.draw();
        }
        )

    }

    drawParticles() {
        this.gammanager.poolingParticles.draw();
    }

    drawWayPoint() {
        this.gammanager.wayPoints.forEach(dot => {
            dot.draw();
        }
        )
    }

    drawTextScores() {
        this.gammanager.poolingTextScore.draw();
    }


}