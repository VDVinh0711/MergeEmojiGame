export class CollisionManager {
    constructor(gameManager) {
        this.gameManager = gameManager;
        this.isCollidingWithBoundary = false;
    }

    checkCollisions() {
        this.resetCollisions();
        this.handleEmojiCollisions();
        this.checkBoundaryCollisions(this.gameManager.Box);
        this.detectedColisionBox(this.gameManager.Box);
    }

    resetCollisions() {
        this.gameManager.poolingEmojis.activeObjs.forEach(obj => {
            obj.isColiding = false;
        });
    }

    handleEmojiCollisions() {
        const activeObjects = Array.from(this.gameManager.poolingEmojis.activeObjs);
        for (let i = activeObjects.length - 1; i >= 0; i--) {
            const obj1 = activeObjects[i];
            for (let j = activeObjects.length - 1; j >= i + 1; j--) {
                const obj2 = activeObjects[j];
                if (obj1.CheckColision(obj2)) {
                    if(obj1.type == obj2.type && obj1.canMerge && obj2.canMerge)
                    {
                        this.gameManager.MergedEmojis(obj1, obj2)
                    }
                    else
                    {
                        this.resolveCollision(obj1, obj2);
                        obj1.handleColison();
                        obj2.handleColison();
                    }
                }
            }
        }
       
    }

    checkBoundaryCollisions(Box) {
        let count = 0;
        this.gameManager.poolingEmojis.activeObjs.forEach(obj => {
            if (obj.canCheckLose && obj.y - obj.radius / 2 < Box.topBox) {
                count++;
            }
        });
       this.isCollidingWithBoundary =  count > 0;
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

    detectedColisionBox(Box)
    {
        this.gameManager.poolingEmojis.activeObjs.forEach(gameObject => {
            if (gameObject.x < Box.leftBox + gameObject.radius) {
                gameObject.vx = Math.abs(gameObject.vx) * 0.5;
                gameObject.x = Box.leftBox + gameObject.radius;
            }
            else if (gameObject.x + gameObject.radius >= Box.rightBox) {
                gameObject.vx = -Math.abs(gameObject.vx) * 0.5;
                gameObject.x = Box.rightBox - gameObject.radius;
            }

            if (gameObject.y + gameObject.radius >= Box.bottomBox &&
                gameObject.x > Box.leftBox && gameObject.x < Box.rightBox
            ) {
                gameObject.vy = -Math.abs(gameObject.vy) * 0.1;
                gameObject.vx *= 0.95;
                gameObject.y = Box.bottomBox - gameObject.radius;
            }

            //this.gameManager.componentManger.Box.colisionWithBox(gameObject);
        }
        )
    }
}