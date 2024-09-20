export class ScoreManager {
    constructor() {
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
    }

    getScore() {
        return this.score;
    }

    resetScore() {
        this.score = 0;
    }
}