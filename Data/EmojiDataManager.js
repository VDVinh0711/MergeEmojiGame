const TypeOfEmoji =
{
    Angry: 'Angry',
    Sick: 'Sick',
    Sad: 'Sad',
    Normal: 'Normal',
    Happy: 'Happy',
    Wow: 'Wow',
    Funny: 'Funny'
}






const DataEmojis = {
    Angry: createFruit(TypeOfEmoji.Angry, './Asset/Emoji/Angry.png', 30, 10),
    Sick: createFruit(TypeOfEmoji.Sick, './Asset/Emoji/Sick.png', 35, 20),
    Sad: createFruit(TypeOfEmoji.Sad, './Asset/Emoji/Sad.png', 40, 30),
    Normal: createFruit(TypeOfEmoji.Normal, './Asset/Emoji/Normal.png', 45, 40),
    Happy: createFruit(TypeOfEmoji.Happy, './Asset/Emoji/Happy.png', 50, 50),
    Wow: createFruit(TypeOfEmoji.Wow, './Asset/Emoji/WOW.png', 55, 60),
    Funny: createFruit(TypeOfEmoji.Funny, './Asset/Emoji/Funny.png', 60, 70),
};

function createFruit(type, srcIMG, radius, score) {
    return {
        type,
        srcIMG,
        initialRadius: radius,
        radius,
        score,
    };
}



export default class EmojiDatas {
    static GetListEmojiDatas() {
        let listEmoji = Object.values(TypeOfEmoji);
        return listEmoji;
    }
    static GetLastEmoji() {
        let listEmoji = Object.values(TypeOfEmoji);
        const lastIndex = listEmoji.length - 1;
        return   EmojiDatas.GetAssetEmoji(listEmoji[lastIndex]);
    }
    static GetRandomTypeEmoji() {
        const emojis = Object.values(TypeOfEmoji);
        const randomIndex = Math.floor(Math.random() * emojis.length / 2);
        return emojis[randomIndex];
    }

    static GetAssetEmoji(type) {
        return Object.values(DataEmojis).find(emoji => emoji.type === type);
    }

    static getNextEmoji(current) {
        const emojis = Object.values(TypeOfEmoji);
        const currentIndex = emojis.indexOf(current);
        if (currentIndex === -1) {
            throw new Error('Emoji not found');
        }
        const nextIndex = (currentIndex + 1) % emojis.length;
        return EmojiDatas.GetAssetEmoji(emojis[nextIndex]);
    }

    static upDateLevel(level)
    {
        console.log(level);
        for (let key in DataEmojis) {
            // Lấy object hiện tại
            let emojiObject = DataEmojis[key];
            emojiObject.radius  = emojiObject.initialRadius * level;
        }
    }
}





