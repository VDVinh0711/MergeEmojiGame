

const soundsBackGround = 
{
    background : new Audio('./Asset/Sound/background.mp3'),
}

const soundSFX = 
{
    mergesound : new Audio('./Asset/Sound/popv2.mp3'),
    wingame : new Audio('./Asset/Sound/winSound.mp3'),
    losegame : new Audio('./Asset/Sound/loseSound.mp3')
}


export default class SoundManager
{

    static volume =1;

    static PlaySoundBackGround(namesound)
    {
        soundsBackGround[namesound].play();
        soundsBackGround[namesound].loop = true;
        soundsBackGround[namesound].volume = this.volume;
    }

    static PlaySoundSFX(namesound)
    {
        soundSFX[namesound].play();
        soundSFX[namesound].volume = this.volume;
    }
}