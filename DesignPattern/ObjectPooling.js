

export class ObjectPooling
{
    constructor(context,objType,poolSize)
    {
        this.objType = objType;
        this.context = context;
        this.pool = [];
        this.activeObjs = new Set();
        for(let i = 0 ; i< poolSize;i++)
        {
            this.pool.push(new objType());
        }
    }

    get()
    {
        if(this.pool.length > 0)
        {
            let object = this.pool.pop();
            this.activeObjs.add(object);
            return object;
        }
        else
        {
            let newObj = new this.objType();
            this.activeObjs.add(newObj);
            return newObj;
        }
    }

    deSpawn(object)
    {
        if (this.activeObjs.has(object)) {
            object.reset();
            this.activeObjs.delete(object);
            this.pool.push(object);
        }
    }

    update(deltaTime) {
        this.activeObjs.forEach(object => {
            if (object.isActive) {
                object.update(deltaTime);
            } else {
                this.deSpawn(object);
            }
        });
    }

    draw() {
        this.activeObjs.forEach(object => {
            object.draw();
        });
    }

    reset()
    {
        this.activeObjs.forEach(object => {
          this.deSpawn(object);
        });
    }
}