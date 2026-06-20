export class InputController {
  constructor() {
    this.state = {
      left: false,
      right: false,
      down: false,
      downPressed: false,
      downDoublePressed: false,
      jump: false,
      jumpPressed: false,
    };
    this.lastDownPressedAt = -Infinity;
  }

  bind() {
    window.addEventListener("keydown", (event) => {
      if (["KeyA", "KeyD", "KeyW", "KeyS", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(event.code)) {
        event.preventDefault();
      }
      this.setKey(event.code, true);
    });

    window.addEventListener("keyup", (event) => {
      this.setKey(event.code, false);
    });
  }

  consumeJumpPressed() {
    const pressed = this.state.jumpPressed;
    this.state.jumpPressed = false;
    return pressed;
  }

  consumeDownDoublePressed() {
    const pressed = this.state.downDoublePressed;
    this.state.downDoublePressed = false;
    return pressed;
  }

  setKey(code, down) {
    if (code === "KeyA" || code === "ArrowLeft") this.state.left = down;
    if (code === "KeyD" || code === "ArrowRight") this.state.right = down;
    if (code === "KeyS" || code === "ArrowDown") {
      if (down && !this.state.down) {
        const now = performance.now();
        this.state.downPressed = true;
        this.state.downDoublePressed = now - this.lastDownPressedAt <= 300;
        this.lastDownPressedAt = now;
      }
      if (!down) this.state.downPressed = false;
      this.state.down = down;
    }
    if (code === "KeyW" || code === "ArrowUp" || code === "Space") {
      if (down && !this.state.jump) this.state.jumpPressed = true;
      this.state.jump = down;
    }
  }
}
