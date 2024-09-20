export class TimeManager
{
    constructor()
    {
        this.time = 0;
    }

    resetTime()
    {
        this.time = 0;
    }

    updateTime(deltatime)
    {
        this.time = Math.round((this.time + deltatime) * 100) / 100
    }

}
