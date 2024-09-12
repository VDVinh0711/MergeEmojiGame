export class InputHandler {
  
    constructor(canvas, context) {
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
            this.eventListeners[eventName].forEach(callback => {
                callback(data);
            });
        }
    }

    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        this.emit('mouseDown', { x: x, y: y });
        this.canDrag = true;
    }

    handleMouseUp(event) {
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        this.canDrag = false;
        this.emit('mouseUp', { x: x, y: y});
    }

    handleMouseMove(event) {
        if (!this.canDrag) return;
        const rect = this.canvas.getBoundingClientRect();
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        this.emit('mouseMove', { x: x, y: y});
    }
}