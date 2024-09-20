export default class LevelManager {
    static LevelType = {
        EASY: 'easy',
        MEDIUM: 'medium',
        HARD: 'hard'
    };

    static levelRecords = {
        [LevelManager.LevelType.EASY]: { bestTime: Infinity },
        [LevelManager.LevelType.MEDIUM]: { bestTime: Infinity },
        [LevelManager.LevelType.HARD]: { bestTime: Infinity }
    };

    static currentLevel = LevelManager.LevelType.EASY;

    static setCurrentLevel(level) {
        console.log(level);
        if (this.levelRecords.hasOwnProperty(level)) {
            this.currentLevel = level;
            return true;
        }
        return false;
    }

    static getCurrentLevel() {
        return this.currentLevel;
    }

    static setNewRecord(record) {
        const currentLevelRecord = this.levelRecords[this.currentLevel];
        if (record < currentLevelRecord.bestTime) {
            currentLevelRecord.bestTime = record;
            return true;
        }
        return false;
    }

    static getBestTime(level) {
        return this.levelRecords[level]?.bestTime ?? Infinity;
    }

    static isNewRecord(time, level = this.currentLevel) {
        return time < this.getBestTime(level);
    }

    static getLevelDifficulty(level = this.currentLevel) {
        switch (level) {
            case this.LevelType.EASY:
                return 1;
            case this.LevelType.MEDIUM:
                return 1.5;
            case this.LevelType.HARD:
                return 2;
            default:
                return 1;
        }
    }
}