

const sounds = 
{
    background : new Audio('./Asset/Sound/background.mp3'),
    mergesound : new Audio('./Asset/Sound/popv2.mp3'),
    wingame : new Audio('./Asset/Sound/winSound.mp3'),
    losegame : new Audio('./Asset/Sound/loseSound.mp3')
}



export default class SoundManager
{
    static PlaySound(namesound)
    {
        sounds[namesound].play();
    }
}