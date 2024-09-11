export class ScoreManager {
    constructor() {
        this.score = 0;
        this.time = 0;
        this.bestime = 0;
    }

    addPoints(points) {
        this.score += points;
    }

    upDateTime(deltatime)
    {
        this.time += deltatime;
    }
    upDateBestTime() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
    }

    reset() {
        this.score = 0;
    }
}