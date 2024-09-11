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
        this.drawFps();
        this.drawBox();
        this.drawGameObject();
        this.drawParticles();
        this.drawWayPoint();
        this.drawTextScores();
        this.drawPlayerPoint();
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
        this.context.fillStyle = 'pink';
        this.context.rect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fill();
    }

    drawZoneSpawm() {
        this.context.beginPath();
        this.context.lineWidth = 2;
        this.context.strokeStyle = 'red';
        this.context.rect(this.gammanager.leftBox, 0, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.topBox);
        this.context.stroke();
    }

    drawBox() {
        this.context.beginPath();
        this.context.fillStyle = 'white';
        this.context.rect(this.gammanager.leftBox, this.gammanager.topBox, this.gammanager.rightBox - this.gammanager.leftBox, this.gammanager.bottomBox - this.gammanager.topBox);
        this.context.fill();

        this.context.beginPath();
        this.context.lineWidth = 10;
        this.context.strokeStyle = 'black';
        this.context.moveTo(this.gammanager.leftBox, this.gammanager.topBox);
        this.context.lineTo(this.gammanager.leftBox, this.gammanager.bottomBox);
        this.context.lineTo(this.gammanager.rightBox, this.gammanager.bottomBox);
        this.context.lineTo(this.gammanager.rightBox, this.gammanager.topBox);
        this.context.stroke();
    }



    drawPlayerPoint() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = '20px Arial';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Score : ${this.gammanager.playerScore}`, 0, 50);
    }

    drawBestTimePlayer() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.fillText(`Best Time : ${this.gammanager.bestTime}`, 0, 80);
        this.context.font = '20px Arial';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
    }

    drawTimeInGame() {
        this.context.beginPath();
        this.context.fillStyle = 'black';
        this.context.font = '20px Arial';
        this.context.textAlign = 'left';
        this.context.textBaseline = 'top';
        this.context.fillText(`Clock : ${this, this.gammanager.timeInGame}`, 0, 110);
    }



    drawUserGuide() {
        this.gammanager.userGuide.forEach(element => {
            element.draw();
        });
    }
    drawGameObject() {
        this.gammanager.gameObjects.forEach(gameObject => {
            gameObject.draw();
        });

    }

    drawParticles() {
        this.gammanager.listParticles.forEach(particle => {
            particle.draw();
        });
    }

    drawWayPoint() {
        this.gammanager.wayPoints.forEach(dot => {
            dot.draw();
        }
        )
    }

    drawTextScores() {
        this.gammanager.textScores.forEach(textScore => {
            textScore.draw();
        }
        )
    }


}