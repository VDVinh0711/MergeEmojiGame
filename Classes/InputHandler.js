export class InputHandler {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.canvas = gameManager.canvas;
        this.context = gameManager.context;
        this.newEmoji = null;
        this.isDrag = false;
        this.canSpawm = true;
        this.currentSpawmDelay = 0.5;
        initEventListener();
    }


    initEventListener() {
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
        document.addEventListener('mouseup', this.handleMouseUp.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseDown(event) {
        if (!this.canSpawn) return;
        if (event.clientY - this.canvas.getBoundingClientRect().top >= this.gameManager.topBox) return;

        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        const emojiType = EmojiDatas.GetRandomTypeEmoji();
        const assetEmoji = EmojiDatas.GetAssetEmoji(emojiType);
        this.newEmoji = new Emoji(this.context, x, y, 0, 0, assetEmoji.radius, assetEmoji.type, assetEmoji.srcIMG);
        this.newEmoji.useGravity = false;
        this.gameManager.gameObjects.push(this.newEmoji);

        this.gameManager.createWayPoints({ x: x, y: y + this.newEmoji.radius });
        this.isDrag = true;
    }

    handleMouseUp(event) {
        if (!this.newEmoji) return;
        this.isDrag = false;
        this.gameManager.waypoints = [];
        this.newEmoji.useGravity = true;
        this.canSpawn = false;
        this.newEmoji = null;
    }

    handleMouseMove(event) {
        if (!this.isDrag) return;
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;

        if (y >= this.gameManager.topBox) {
            y = this.gameManager.topBox - this.newEmoji.radius;
        }
        if (x <= this.gameManager.leftBox + this.newEmoji.radius) {
            x = this.gameManager.leftBox + this.newEmoji.radius;
        }
        if (x >= this.gameManager.rightBox - this.newEmoji.radius) {
            x = this.gameManager.rightBox - this.newEmoji.radius;
        }

        this.newEmoji.x = x;
        this.newEmoji.y = y;
        this.gameManager.waypoints = [];
        this.gameManager.createWayPoints({ x: x, y: y + this.newEmoji.radius });
    }

    update(deltaTime) {
        if (!this.canSpawn) {
            this.currentSpawnDelay -= deltaTime;
            if (this.currentSpawnDelay <= 0) {
                this.canSpawn = true;
                this.currentSpawnDelay = 0.5;  // Reset to initial spawn delay
            }
        }
    }
}