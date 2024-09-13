import EmojiDatas from '../Data/EmojiDataManager.js';
import { Emoji } from '../Entity/Emoji.js';
export class UserGuide
{
    constructor(context)
    {    
        this.context = context;
        this.listObj = [];
    }


    createFormulaGuide(x, y) {
        const space = 30;
        let listDataEmojis = EmojiDatas.GetListEmojiDatas();
        listDataEmojis.forEach(emoji => {
            const assetEmoji = EmojiDatas.GetAssetEmoji(emoji);
            const newEmoji = new Emoji();
            newEmoji.init(this.context, x, y, 0, 0, assetEmoji.radius / 2, assetEmoji.type, assetEmoji.srcIMG);
            this.listObj.push(newEmoji);
            x += assetEmoji.radius + space;
        });
    }


    render()
    {
        this.listObj.forEach(obj => {
            obj.draw();
        });
    }
}