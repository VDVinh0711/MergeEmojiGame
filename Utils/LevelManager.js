

export default class LevelManager {

    static LevelType =
        {
            easy: 'easy',
            medium: 'medium',
            hard: 'hard'
        }

    static leveRecord =
        {
            Easy:
            {
                type: LevelManager.LevelType.easy,
                besttime: 0,
            },
            Medium:
            {
                type: LevelManager.LevelType.medium,
                besttime: 0,
            },
            Hard:
            {
                type: LevelManager.LevelType.hard,
                besttime: 0,
            }
        }
    static SetNewRecord(type , record)
    {
        for (let key in this.leveRecord) {
            
            let level = this.leveRecord[key];
            if(level.type != type) continue;
            if(level.besttime > record || level.besttime == 0)
            {
                level.besttime = record;
            }
        }
    }
}