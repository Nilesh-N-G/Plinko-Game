class Ball {
    constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = color;
      this.vx = 0;
      this.vy = 0;
    }
  
    draw(ctx, unpad) {
      ctx.beginPath();
      ctx.arc(unpad(this.x), unpad(this.y), this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  
    update(obstacles, sinks, gravity, horizontalFriction, verticalFriction, unpad, pad) {
      // Apply gravity
      this.vy += gravity;
      this.x += this.vx;
      this.y += this.vy;
  
      // Check collision with obstacles
      obstacles.forEach((obstacle) => {
        const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);
        if (dist < pad(this.radius + obstacle.radius)) {
          const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
          const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
          this.vx = Math.cos(angle) * speed * horizontalFriction;
          this.vy = Math.sin(angle) * speed * verticalFriction;
  
          const overlap = this.radius + obstacle.radius - unpad(dist);
          this.x += pad(Math.cos(angle) * overlap);
          this.y += pad(Math.sin(angle) * overlap);
        }
      });
  
      // Check collision with sinks
      sinks.forEach((sink) => {
        if (
          unpad(this.x) > sink.x - sink.width / 2 &&
          unpad(this.x) < sink.x + sink.width / 2 &&
          unpad(this.y) + this.radius > sink.y - sink.height / 2
        ) {
          this.vx = 0;
          this.vy = 0;
        }
      });
    }
  }
  
  export default Ball;
  