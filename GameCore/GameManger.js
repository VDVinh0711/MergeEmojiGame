import { InputHandler } from '../Utils/InputHandler.js';
import { Particle } from '../Classes/Particle.js';
import EmojiDatas from '../Data/EmojiDataManager.js';
import { GameRenderer } from './GameRenderer.js';
import { TextScore } from '../Classes/TextScore.js';
import { Dot } from '../Classes/Dot.js';
import { Emoji } from '../Classes/Emoji.js';

import { ObjectPooling } from '../DesignPattern/ObjectPooling.js';
import { UIManager } from '../UI/UIManager.js';

export class GameManager {
    constructor(uimanager) {
        this.canvas = document.getElementById("mainview");
        this.context = this.canvas.getContext('2d');

        

        //ref
        this.uimanager = uimanager;

        //this.textScores = [];
        this.isWin = false;
        this.isLose = false;

        //GameConfig
        this.fps = 0;
        this.timeInGame = 0;


        //Utils
        this.wayPoints = []
        this.userGuide = [];
 


        this.loseCountdownTime = 4;
        this.initialLoseCountdownTime = 4;


        //PlayerConfig
        this.playerScore = 0;
        this.bestTime = 0;


        //Box Config
        this.rightBox = 0;
        this.leftBox = 0;
        this.topBox = 0;
        this.bottomBox = 0;

        this.inputHandler = new InputHandler(this.canvas, this.context);
        this.renderer = new GameRenderer(this);
        this.poolingParticles = new ObjectPooling(this.context, Particle, 100);
        this.poolingEmojis = new ObjectPooling(this.context,Emoji,100);
        this.poolingTextScore = new ObjectPooling(this.context,TextScore,50);

        this.isGameActive = true;
        this.isPause = false;

        this.onActionWin = null;
        this.onActionLose = null;
        this.Init();
    }


   
    addUIManger(uiManager)
    {
        this.uimanager = uiManager;
    }

    Init() {

        this.setParamsForBox();
        this.setupEventListeners();
        this.createFormulaGuide(this.leftBox+ 50, this.canvas.height-100)
    }

    setupEventListeners() {
        this.inputHandler.on('mouseDown', this.handleMouseDown.bind(this));
        this.inputHandler.on('mouseMove', this.handleMouseDrag.bind(this));
        this.inputHandler.on('mouseUp', this.handleMouseUp.bind(this));
    }

    ResetGame() {
        this.isWin = false;
        this.isLose = false;
        this.playerScore = 0;
        this.isGameActive = true;
        this.isPause = false;


        this.poolingEmojis.reset();
        this.poolingParticles.reset();
        this.poolingTextScore.reset();
    }

    setParamsForBox() {
        this.rightBox = this.canvas.width / 2 + 300;
        this.leftBox = this.canvas.width / 2 - 300;
        this.bottomBox = this.canvas.height - 200;
        this.topBox = this.bottomBox - 500;
    }


    update(deltatime) {

        if(!this.isGameActive) return;
        if(this.isPause) return;
        //Fps
        this.fps = Math.round(1 / deltatime);
        if (this.isWin || this.isLose) return;

        //Time
        this.timeInGame = Math.round((this.timeInGame + deltatime) * 100) / 100

        // //Change Obj to state can Merge
        // for (let i = 0; i < this.gameObjects.length; i++) {
        //     if (this.gameObjects[i].canMerge) continue;
        //     this.gameObjects[i].updateCanMerge(this.topBox);
        // }


        this.poolingEmojis.activeObjs.forEach(obj =>
        {
            if(!obj.canMerge)
            {
                obj.updateState(this.topBox);
            }
        }
        )

        //Obj
        // this.gameObjects.forEach(gameObject => {
        //     gameObject.update(deltatime)
        // });

        this.poolingEmojis.activeObjs.forEach(gameObject =>
        {
            gameObject.update(deltatime);
        }
        )

        //Particles
        // this.listParticles.forEach((particle, index) => {
        //     if (particle.alpha <= 0) {
        //         this.listParticles.splice(index, 1)
        //     } else {
        //         particle.update(deltatime)
        //     }
        // });

        this.poolingParticles.update(deltatime);
        
        // //Update TextScore
        // this.textScores.forEach((element, index) => {
        //     if (element.alpha <= 0) {
        //         this.textScores.splice(index, 1)
        //     } else {
        //         element.update(deltatime)
        //     }
        // });

        this.poolingTextScore.update(deltatime);
        //Check Lose
        if (this.isCollidingWithBoundary()) {
            this.loseCountdownTime -= deltatime;
            if (this.loseCountdownTime <= 0) {
              
                this.isLose = true;
                console.log("losse")
            }

        }
        else {
            this.loseCountdownTime = this.initialLoseCountdownTime;
        }
    }


    draw() {
        if(!this.isGameActive) return;

        this.renderer.render();
    }


    gameColision() {
        //Reset Collision

        this.poolingEmojis.activeObjs.forEach(obj =>
        {
            obj.isColiding = false;
        }
        )

        const activeObjects = Array.from(this.poolingEmojis.activeObjs);
        for (let i = activeObjects.length - 1; i >= 0; i--) {
            const obj1 = activeObjects[i];
            for (let j = activeObjects.length - 1; j >= i + 1; j--) {
                const obj2 = activeObjects[j];
                if (obj1.CheckColision(obj2)) {
                    const isMerge = this.MergedEmojis(obj1, obj2);
                    if (!isMerge) {
                        this.resolveCollision(obj1, obj2);
                        obj1.handleColison();
                        obj2.handleColison();
                    }
                }
            }
        }

        // this.gameObjects.forEach(obj => {
        //     obj.isColiding = false;
        // });

        // //Check Colision With Us
        // for (let i = this.gameObjects.length - 1; i >= 0; i--) {
        //     const obj1 = this.gameObjects[i];
        //     for (let j = this.gameObjects.length - 1; j >= i + 1; j--) {
        //         const obj2 = this.gameObjects[j];
        //         if (obj1.CheckColision(obj2)) {
        //             const isMerge = this.MergedEmojis(obj1, obj2, j);
        //             if (!isMerge) {
        //                 this.resolveCollision(obj1, obj2);
        //                 obj1.handleColison();
        //                 obj2.handleColison();
        //             }
        //         }
        //     }
        // }

        this.detectedColisionBox();


    }

    resolveCollision(obj1, obj2) {
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const overlap = (obj1.radius + obj2.radius) - distance;

        if (overlap > 0) {

            const moveX = (overlap * dx) / distance / 2;
            const moveY = (overlap * dy) / distance / 2;

            obj1.x -= moveX;
            obj1.y -= moveY;
            obj2.x += moveX;
            obj2.y += moveY;


            const nx = dx / distance;
            const ny = dy / distance;
            const p = 2 * (nx * (obj2.vx - obj1.vx) + ny * (obj2.vy - obj1.vy)) / (obj1.mass + obj2.mass);

            obj1.vx += p * obj2.mass * nx;
            obj1.vy += p * obj2.mass * ny;
            obj2.vx -= p * obj1.mass * nx;
            obj2.vy -= p * obj1.mass * ny;
        }
    }

    isCollidingWithBoundary() {
       
        // for (let i = 0; i < this.gameObjects.length; i++) {
        //     if (!this.gameObjects[i].canCheckLose) continue;
        //     if (this.gameObjects[i].y <= this.topBox) {
        //         holder.push(gameObjects[i]);
        //     }
        // }
        let count = 0;
        this.poolingEmojis.activeObjs.forEach(obj =>
        {
            if(obj.canCheckLose && obj.y - obj.radius/2 < this.topBox)
            {
                count++;
            }
        });
        return count > 0;
    }

    detectedColisionBox() {

        this.poolingEmojis.activeObjs.forEach(gameObject =>
        {
            if (gameObject.x < this.leftBox + gameObject.radius) {
                gameObject.vx = Math.abs(gameObject.vx) * 0.5;
                gameObject.x = this.leftBox + gameObject.radius;
            }
            else if (gameObject.x + gameObject.radius >= this.rightBox) {
                gameObject.vx = -Math.abs(gameObject.vx) * 0.5;
                gameObject.x = this.rightBox - gameObject.radius;
            }

            if (gameObject.y + gameObject.radius >= this.bottomBox &&
                gameObject.x > this.leftBox && gameObject.x < this.rightBox
            ) {
                gameObject.vy = -Math.abs(gameObject.vy) * 0.5;
                gameObject.vx *= 0.95;
                gameObject.y = this.bottomBox - gameObject.radius;
            }
        }
        )

        // this.gameObjects.forEach(gameObject => {
        //     if (gameObject.x < this.leftBox + gameObject.radius) {
        //         gameObject.vx = Math.abs(gameObject.vx) * 0.5;
        //         gameObject.x = this.leftBox + gameObject.radius;
        //     }
        //     else if (gameObject.x + gameObject.radius >= this.rightBox) {
        //         gameObject.vx = -Math.abs(gameObject.vx) * 0.5;
        //         gameObject.x = this.rightBox - gameObject.radius;
        //     }

        //     if (gameObject.y + gameObject.radius >= this.bottomBox &&
        //         gameObject.x > this.leftBox && gameObject.x < this.rightBox
        //     ) {
        //         gameObject.vy = -Math.abs(gameObject.vy) * 0.5;
        //         gameObject.vx *= 0.95;
        //         gameObject.y = this.bottomBox - gameObject.radius;
        //     }
        // });
    }



    MergedEmojis(obj1, obj2, ) {
        if (obj1.type == obj2.type && obj1.canMerge && obj2.canMerge) {
            const nextEmoji = EmojiDatas.getNextEmoji(obj1.type);
            //Check Win

           
            if (nextEmoji.type == EmojiDatas.GetLastEmoji().type) {
                this.upDateBestTime(this.timeInGame);
                this.isWin = true;
                this.uimanager.ActionWin(this.playerScore,this.timeInGame);
            }

            //UpdateEmoji
            obj1.updateModelEmoji(nextEmoji.radius, nextEmoji.type, nextEmoji.srcIMG);
            //this.gameObjects.splice(index2, 1);
            this.poolingEmojis.deSpawn(obj2);

            //Update Point
            this.addPointPlayer(nextEmoji.score);

            this.InstantiateTextScore(obj1.x, obj1.y - obj1.radius, nextEmoji.score);

            //Create Partical
            this.spawmParticles(obj1.x, obj1.y);

            return true;
        }
        return false;
    }


    //Instan score Text when merge
    InstantiateTextScore(posX, posY, score) {
        
        let textScoreSpawm = this.poolingTextScore.get();
        textScoreSpawm.init(this.context,posX,posY,` + ${score}`);
       // this.textScores.push(new TextScore(this.context, posX, posY, ` + ${score}`));
    }

    upDateBestTime(time) {
        if (time < this.bestTime) {
            this.bestTime = time;
        }
        if (this.bestTime == 0) {
            this.bestTime = time;
        }

    }

    addPointPlayer(score) {
        this.playerScore += score;
    }

    createWayPoints(pos) {
        const spaceSize = 30;
        let posBegin =
        {
            x: pos.x,
            y: pos.y
        }
        for (let i = 0; i < 5; i++) {
            const newDot = new Dot(this.context, posBegin.x, posBegin.y);
            this.wayPoints.push(newDot);
            posBegin.y += spaceSize;
        }
    }


    createFormulaGuide(x, y) {
        const space = 30;
        let listDataEmojis = EmojiDatas.GetListEmojiDatas();
        listDataEmojis.forEach(emoji => {
            const assetEmoji = EmojiDatas.GetAssetEmoji(emoji);
            const newEmoji = new Emoji();
            newEmoji.init(this.context, x, y, 0, 0, assetEmoji.radius / 2, assetEmoji.type, assetEmoji.srcIMG);
            this.userGuide.push(newEmoji);
            x += assetEmoji.radius + space;
        });
    }


    spawmParticles(posX, posY) {
        for (let i = 0; i < 50; i++) {
            // this.listParticles.push(
            //     new Particle(this.context, posX, posY,
            //         Math.floor(Math.random() * (15 - 10 + 1)) + 10,
            //         'yellow',
            //         (Math.random() - 0.5) * (Math.random() * 6) * 100,
            //         (Math.random() - 0.5) * (Math.random() * 6) * 100
            //     )
            // )

            const particle = this.poolingParticles.get();
            particle.init(
                this.context, posX, posY,
                Math.floor(Math.random() * (15 - 10 + 1)) + 10,
                'yellow',
                (Math.random() - 0.5) * (Math.random() * 6) * 100,
                (Math.random() - 0.5) * (Math.random() * 6) * 100
            )

        }
    }







    //Event Handle Mouse
    handleMouseDown(mousePos) {
        // Logic for mouse down
        if(this.isPause) return;
        if (this.isWin || this.isLose) return;        
        if(mousePos.y > this.topBox - EmojiDatas.GetLastEmoji().radius ) return;

      
        this.newEmoji = this.poolingEmojis.get();
        const emojiType = EmojiDatas.GetRandomTypeEmoji();
        const assetEmoji = EmojiDatas.GetAssetEmoji(emojiType);
        this.newEmoji.init(this.context, mousePos.x, mousePos.y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG);
        this.newEmoji.useGravity = false;
        this.createWayPoints({ x: mousePos.x, y: mousePos.y + this.newEmoji.radius });
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
        this.wayPoints = [];
        this.createWayPoints({ x: mousePos.x, y: mousePos.y + this.newEmoji.radius });
    }
    handleMouseUp(mousePos) {
        if (!this.newEmoji) return;
        this.wayPoints = [];
        this.newEmoji.useGravity = true;
        this.newEmoji = null;
    }
    //End Event Mouse



}