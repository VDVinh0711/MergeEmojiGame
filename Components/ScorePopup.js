
import { ObjectPooling } from "../DesignPattern/ObjectPooling.js";
import { TextScore } from "../Entity/TextScore.js";
export class ScorePopup
{
    constructor(context, color)
    {
        this.context = context;
        this.color  = color;
        this.poolingTextScore = new ObjectPooling(this.context, TextScore, 50);
    }

    spawm(x,y,score)
    {
        let textScoreSpawm = this.poolingTextScore.get();
        textScoreSpawm.init(this.context, x, y, ` + ${score}`);
    }

    update(deltatime)
    {
        this.poolingTextScore.update(deltatime);
    }

    render()
    {
        this.poolingTextScore.draw();
    }

    clear()
    {
        this.poolingTextScore.reset();
    }
}