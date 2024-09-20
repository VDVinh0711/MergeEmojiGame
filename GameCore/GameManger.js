import { InputHandler } from '../Utils/InputHandler.js';
import EmojiDatas from '../Data/EmojiDataManager.js';
import { GameRenderer } from './GameRenderer.js';
import { Emoji } from '../Entity/Emoji.js';
import { ObjectPooling } from '../DesignPattern/ObjectPooling.js';
import LevelManager from '../Utils/LevelManager.js';
import SoundManager from '../Utils/SoundManager.js';
import { ComponentManager } from './ComponentManager.js';
import { EventEmitter } from '../DesignPattern/EventEmiter.js';
import { ScoreManager } from './ScoreManager.js';
import { CollisionManager } from './ColisionManager.js';
import { TimeManager } from './TimeManager.js';


export class GameManager extends EventEmitter {

    constructor() {

        super();
        this.canvas = document.getElementById("mainview");
        this.context = this.canvas.getContext('2d');
        //GameConfig
        this.isWin = false;
        this.isLose = false;

        this.loseCountdownTime = 4;
        this.initialLoseCountdownTime = 4;

        //PlayerConfig
       
        this.playerScore = new ScoreManager();
        this.collisionManager = new CollisionManager(this);
        this.timeManager = new TimeManager();

        //Box Config
        this.rightBox = 0;
        this.leftBox = 0;
        this.topBox = 0;
        this.bottomBox = 0;
        this.componentManger = new ComponentManager(this.context);
        this.inputHandler = new InputHandler(this.canvas, this.context);
        this.renderer = new GameRenderer(this);
        this.poolingEmojis = new ObjectPooling(this.context, Emoji, 100);
        this.isGameActive = true;
        this.isPause = false;

        this.Init();
    }

   

    Init() {
        this.setParamsForBox();
        this.setupEventListeners();
        this.componentManger.userGuide.createFormulaGuide(this.leftBox + 50, this.canvas.height - 100);
    }

    setupEventListeners() {
        this.inputHandler.on('mouseDown', this.handleMouseDown.bind(this));
        this.inputHandler.on('mouseMove', this.handleMouseDrag.bind(this));
        this.inputHandler.on('mouseUp', this.handleMouseUp.bind(this));
    }


    PlayGame(Level) {
        if (LevelManager.setCurrentLevel(Level)) {
            const difficulty = LevelManager.getLevelDifficulty();
            EmojiDatas.upDateLevel(difficulty);
            this.ResetGame();
        } else {
            console.error("Invalid level type");
        }
    }

    ResetGame() {
        this.isWin = false;
        this.isLose = false;
        this.playerScore.resetScore();
        this.isGameActive = true;
        this.isPause = false;
        this.timeManager.resetTime();
        this.poolingEmojis.reset();
        this.componentManger.reset();
       
    }

    setParamsForBox() {
        this.rightBox = this.canvas.width / 2 + 300;
        this.leftBox = this.canvas.width / 2 - 300;
        this.bottomBox = this.canvas.height - 200;
        this.topBox = this.bottomBox - 500;
    }


    update(deltatime) {

        if (!this.isGameActive || this.isPause || this.isWin || this.isLose) return;
        //Time
       this.timeManager.updateTime(deltatime);
       //Update State
        this.poolingEmojis.activeObjs.forEach(obj => {
        if (!obj.canMerge) { obj.updateState(this.topBox); }});

        //update Emoji
        this.poolingEmojis.activeObjs.forEach(gameObject => {
            gameObject.update(deltatime);
        });

        this.componentManger.updateComponent(deltatime);
        this.collisionManager.checkCollisions();
        if (this.collisionManager.isCollidingWithBoundary) {
            this.handlePotentialLoss(deltatime);
        }
        else
        {
            this.loseCountdownTime = this.initialLoseCountdownTime;
        }
    }

    draw() {
        if (!this.isGameActive) return;
        this.renderer.render();
        this.componentManger.renderComponent();
    }

    handlePotentialLoss(deltatime) {
        this.loseCountdownTime -= deltatime;
        if (this.loseCountdownTime <= 0) {
            this.isLose = true;
            this.emit('lose', { score: this.playerScore.score});
        }
    }
    MergedEmojis(obj1, obj2,) {
            const nextEmoji = EmojiDatas.getNextEmoji(obj1.type);
            SoundManager.PlaySoundSFX('mergesound');
            //Check Win
            if (nextEmoji.type == EmojiDatas.GetLastEmoji().type) {
             this.handleWin(); 
            }
            obj1.updateModelEmoji(nextEmoji.radius, nextEmoji.type, nextEmoji.srcIMG);
            this.poolingEmojis.deSpawn(obj2);
            this.handleAfterMergeEmoji(obj1,nextEmoji);
    }

    handleWin()
    {
        LevelManager.setNewRecord(this.timeManager.time);
        this.isWin = true;
        console.log("win");
        this.emit('win', { score: this.playerScore.getScore(), time: this.timeManager.time });
    }
    handleAfterMergeEmoji( obj,nextEmoji)
    {
        this.playerScore.addScore(nextEmoji.score);
        this.componentManger.scorePopup.spawm(obj.x, obj.y - obj.radius, nextEmoji.score);
        this.componentManger.particles.spawm(obj.x, obj.y);
    }





    //Event Handle Mouse
    handleMouseDown(mousePos) {
        // Logic for mouse down
        if (this.isPause || this.isWin || this.isLose ||  mousePos.y < 100 ) return;
        if (mousePos.y > this.topBox - EmojiDatas.GetLastEmoji().radius) return;
        this.newEmoji = this.poolingEmojis.get();
        const emojiType = EmojiDatas.GetRandomTypeEmoji();
        const assetEmoji = EmojiDatas.GetAssetEmoji(emojiType);
        this.newEmoji.init(this.context, mousePos.x, mousePos.y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG);
        this.newEmoji.useGravity = false;
        this.componentManger.wayPoints.createPoints({ x: mousePos.x, y: mousePos.y + this.newEmoji.radius });

    }
    handleMouseDrag(mousePos) {

        if (this.newEmoji == null) return;
        if (mousePos.y >= this.topBox - this.newEmoji.radius) {
            mousePos.y = this.topBox - this.newEmoji.radius;
        }
        if (mousePos.x <= this.leftBox + this.newEmoji.radius) {
            mousePos.x = this.leftBox + this.newEmoji.radius;
        }
        if (mousePos.x >= this.rightBox - this.radius) {
            mousePos.x = this.rightBox - this.newEmoji.radius;
        }
        this.newEmoji.x = mousePos.x;
        this.newEmoji.y = mousePos.y;
        this.componentManger.wayPoints.clear();
        this.componentManger.wayPoints.createPoints({ x: mousePos.x, y: mousePos.y + this.newEmoji.radius });
    }
    handleMouseUp(mousePos) {
        if (!this.newEmoji) return;
        this.componentManger.wayPoints.clear();
        this.newEmoji.vx = Math.random() < 0.5 ? -1 : 1;
        this.newEmoji.useGravity = true;
        this.newEmoji = null;
    }
}