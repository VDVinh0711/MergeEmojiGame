
import EmojiDatas from '../Data/EmojiDataManager.js';
import { Emoji } from '../Classes/Emoji.js';
export class InputHandler {
    // constructor(gameManager) {
    //     this.gameManager = gameManager;
    //     this.canvas = gameManager.canvas;
    //     this.context = gameManager.context;
    //     this.newEmoji = null;
    //     this.isDrag = false;
    //     this.canSpawm = false;
    //     this.currentSpawmDelay = 0.5;
    //     this.eventMouseDown = function () { };
    //     this.initEventListener();
    // }


    // initEventListener() {
    //     document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    //     document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    //     document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    // }

    // Reset() {
    //     this.initEventListener();
    //     this.canSpawn = true;
    //     this.currentSpawnDelay = 0.5;
    // }

    // handleMouseDown(event) {

    //     if(this.gameManager.isWin || this.gameManager.isLose) return;
    //     // if (!this.canSpawn) {
    //     //     console.log("run in there");
    //     //     return;
    //     // }
    //     if (event.clientY - this.canvas.getBoundingClientRect().top >= this.gameManager.topBox) return;

     
    //     const rect = this.canvas.getBoundingClientRect();
    //     let x = event.clientX - rect.left;
    //     let y = event.clientY - rect.top;


    //     const emojiType = EmojiDatas.GetRandomTypeEmoji();
    //     const assetEmoji = EmojiDatas.GetAssetEmoji(emojiType);
    //     this.newEmoji = new Emoji(this.context, x, y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG);
    //     this.newEmoji.useGravity = false;
    //     this.gameManager.gameObjects.push(this.newEmoji);

    //     this.gameManager.createWayPoints({ x: x, y: y + this.newEmoji.radius });
    //     this.isDrag = true;
    // }

    // handleMouseUp(event) {
    //     if (!this.newEmoji) return;
    //     this.isDrag = false;
    //     this.gameManager.wayPoint = [];
    //     this.newEmoji.useGravity = true;
    //     this.canSpawn = false;
    //     this.newEmoji = null;
    // }

    // handleMouseMove(event) {
    //     if (!this.isDrag) return;
    //     const rect = this.canvas.getBoundingClientRect();
    //     let x = event.clientX - rect.left;
    //     let y = event.clientY - rect.top;

    //     if (y >= this.gameManager.topBox) {
    //         y = this.gameManager.topBox - this.newEmoji.radius;
    //     }
    //     if (x <= this.gameManager.leftBox + this.newEmoji.radius) {
    //         x = this.gameManager.leftBox + this.newEmoji.radius;
    //     }
    //     if (x >= this.gameManager.rightBox - this.newEmoji.radius) {
    //         x = this.gameManager.rightBox - this.newEmoji.radius;
    //     }

    //     this.newEmoji.x = x;
    //     this.newEmoji.y = y;
    //     this.gameManager.wayPoint = [];
    //     this.gameManager.createWayPoints({ x: x, y: y + this.newEmoji.radius });
    // }

    // update(deltaTime) {
    //     if (!this.canSpawn) {
    //         this.currentSpawnDelay -= deltaTime;
    //         if (this.currentSpawnDelay <= 0) {
    //             this.canSpawn = true;
    //             this.currentSpawnDelay = 0.5;  // Reset to initial spawn delay
    //         }
    //     }
    // }



    constructor(canvas,context) {
        this.canDrag = false;
        this.canvas = canvas;
        this.context = context;
        this.eventListeners = {};
        this.initEventListener();
    }

    initEventListener() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    on(eventName, callback) {
        if (!this.eventListeners[eventName]) {
            this.eventListeners[eventName] = [];
        }
        this.eventListeners[eventName].push(callback);
    }

    emit(eventName, data) {
        if (this.eventListeners[eventName]) {
            this.eventListeners[eventName].forEach(callback => 
                {
                    callback(data);
                });
        }
    }

    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        this.emit('mouseDown', { x: x, y: y });
        this.canDrag  = true;
    }

    handleMouseUp(event) {
        this.canDrag = false;
        this.emit('mouseUp', { x: event.clientX, y: event.clientY });
    }

    handleMouseMove(event) {
        if(!this.canDrag) return;

       
        this.emit('mouseMove', { x: event.clientX, y: event.clientY });
    }
}