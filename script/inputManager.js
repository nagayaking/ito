class InputManager {
    constructor(buttonElement, callbacks) {
        this.callbacks = callbacks;
        this.startTime = 0;
        this.isPressed = false;
        this.releaseTimeout = null;

        buttonElement.addEventListener("mousedown", () => this.handleMouseDown());
        buttonElement.addEventListener("mouseup", () => this.handleMouseUp());
        buttonElement.addEventListener("mouseleave", () => this.handleMouseUp());
    }

    handleMouseDown() {
        clearTimeout(this.releaseTimeout);
        this.isPressed = true;
        this.startTime = Date.now();

        if (this.callbacks.onPress) {
            this.callbacks.onPress();
        }
    }

    handleMouseUp() {
        if(!this.isPressed) return;
        this.isPressed = false;
        const duration = Date.now() - this.startTime;
        this.releaseTimeout = setTimeout(() => {
            if (this.callbacks.onRelease) {
                this.callbacks.onRelease();
            }
        }, 30)
    }
}