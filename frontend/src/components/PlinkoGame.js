import React, { useRef, useEffect, useState } from "react";
import "../App.css";

const DECIMAL_MULTIPLIER = 10000;
const WIDTH = 600;
const HEIGHT = 600;
const obstacleRadius = 4;
const gravity = 0.2 * DECIMAL_MULTIPLIER;
const horizontalFriction = 0.4;
const verticalFriction = 0.8;

const PlinkoGame = ({
  balls,
  sinkPattern,
  setBalance,
  risk,
  totalballs,
  setTotalBalls,
}) => {
  const canvasRef = useRef(null);

  const [sinks, setSinks] = useState([]);
  const [obstacles, setObstacles] = useState([]);
  const animationRef = useRef(null); // To store the animation frame reference
  const [isRunning, setIsRunning] = useState(true); // To control the animation loop
  const [isCreate,setIsCreate]=useState(false);

  useEffect(() => {
    // console.log(
    //   "Risk or sink pattern changed, stopping the loop and clearing canvas."
    // );
    setIsRunning(false);
    setIsCreate((prevIsCreate) => !prevIsCreate);
    // console.log(sinkPattern);
  }, [sinkPattern]);

  const pad = (n) => n * DECIMAL_MULTIPLIER;
  const unpad = (n) => Math.floor(n / DECIMAL_MULTIPLIER);
  const createsink = () => {
    sinks.length = 0;
    // console.log("creating sinks");
    const centerIndex = Math.floor(15 / 2);
    const sinkWidth = 36;
    const NUM_SINKS = 15;
    for (let i = 0; i < NUM_SINKS; i++) {
      let red = 0,
        green = 0,
        blue = 0;
      const x = WIDTH / 2 + (i - 7.5) * sinkWidth + obstacleRadius;
      const y = HEIGHT - 45;
      if (i < centerIndex) {
        // Gradual transition from red to yellow for left sinks
        const t = i / centerIndex;
        red = Math.round(255); // Red stays full intensity
        green = Math.round(20 + (235 * t)); // Transition green from low (20) to high (255)
        blue = 0; // No blue component
      } else if (i === centerIndex) {
        // Center sink is pure yellow
        red = 255;
        green = 255;
        blue = 0;
      } else {
        // Gradual transition from yellow to red for right sinks
        const t = (i - centerIndex) / (NUM_SINKS - centerIndex - 1);
        red = Math.round(255); // Red stays full intensity
        green = Math.round(255 - (235 * t)); // Transition green from high (255) to low (20)
        blue = 0; // No blue component
      }

      const color = `rgb(${red}, ${green}, ${blue})`;
      sinks.push({
        x,
        y,
        width: sinkWidth,
        height: sinkWidth,
        number: i + 1,
        color: color,
        enlarged: false,
      });
    }
  };

  const createobstacle = () => {
    const rows = 16;
    for (let row = 2; row < rows; row++) {
      const numObstacles = row + 1;
      const y = 0 + row * 35;
      const spacing = 36;
      for (let col = 0; col < numObstacles; col++) {
        const x = WIDTH / 2 - spacing * (row / 2 - col);
        obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius });
      }
    }
  };

  // This function will print both the drop position and the sink number when a ball reaches a sink
  const printBallDetails = (ball, sinkNumber) => {
    const dropPosition = `Ball dropped at position: (${ball.initialX.toFixed(
      4
    )}, ${ball.initialY.toFixed(4)})`;
    const reachedSink = `Ball reached sink #${sinkNumber}`;
    // console.log(
    //   dropPosition + ", " + reachedSink + "With Multiplier : " + ball.multiplier +"with return amount : "+ball.returnAmount+" with bet amount : "+ball.betAmt +" with new balance : "+ball.newBalance+" with current balance : "+ball.currentBalance 
    // );
    setBalance(Number(ball.newBalance));
  };

  const drawObstacles = (ctx) => {
    ctx.fillStyle = "white";
    obstacles.forEach((obstacle) => {
      ctx.beginPath();
      ctx.arc(
        unpad(obstacle.x * 1),
        unpad(obstacle.y * 1),
        obstacle.radius * 1,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.closePath();
    });
  };

  const drawSinks = (ctx) => {
    sinks.forEach((sink) => {
      ctx.fillStyle = sink.color;

      // Draw the sink rectangle
      ctx.roundRect(
        sink.x * 1,
        sink.y * 1 - (sink.height * 1) / 2,
        sink.width * 1 - obstacleRadius * 2 * 1,
        sink.height * 1,
        5 // Border radius
      );
      ctx.fill();

      if (sink.enlarged) {
        animateSink(sink, ctx);
      }
    });
  };

  // Function to fill text for sinks
  // Function to fill text for sinks with a sinkPattern
  // Function to fill text for sinks with a sinkPattern array
  const fillSinkText = (ctx, sinkPattern) => {
    for (let index = 0; index < 15; index++) {
      const sink = sinks[index];

      if (sinkPattern[index] === undefined) {
        console.warn(`No value in sinkPattern for index ${index}`);
        continue; // Skip to the next iteration
      }

      // Set the color for the text
      ctx.fillStyle = "black";
      ctx.font = `${Math.round(1 * 12)}px Arial`;

      const textValue =
        (sinkPattern[index] !== undefined ? sinkPattern[index] : "") + "x"; // Fallback to empty string if undefined

      if (textValue) {
        ctx.fillText(textValue, (sink.x + 3.5) * 1, (sink.y + 6) * 1);
      } else {
        console.warn(`No value in sinkPattern for index ${index}`);
      }
    }
  };

  // Add roundRect method to the canvas context
  CanvasRenderingContext2D.prototype.roundRect = function (
    x,
    y,
    width,
    height,
    radius
  ) {
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.lineTo(x + width, y + height - radius);
    this.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this.lineTo(x + radius, y + height);
    this.arcTo(x, y + height, x, y + height - radius, radius);
    this.lineTo(x, y + radius);
    this.arcTo(x, y, x + radius, y, radius);
    this.closePath();
  };

  // Function to animate sink color change when ball reaches it
  const animateSink = (sink, ctx) => {
    // console.log("Animation started");
    if (sink.enlarged) {
      if (!sink.colorChangeTime) {
        sink.colorChangeTime = Date.now(); // Record the start time of the color change
      }

      const elapsedTime = Date.now() - sink.colorChangeTime;
      const duration = 1000; // Duration for color transition in ms

      if (elapsedTime < duration) {
        // Interpolate the color smoothly from green to red (eased transition)
        const t = elapsedTime / duration; // Normalize elapsed time from 0 to 1
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

        // Color interpolation logic: smooth transition from green (0, 255, 0) to red (255, 0, 0)
        const r = Math.floor(255 * easedT);
        const g = Math.floor(255 * (1 - easedT));
        sink.currentColor = `rgb(${r}, ${g}, 0)`; // Transitioning color
      } else {
        // Once the animation is done, reset color and stop the animation
        sink.currentColor = "green"; // Return to original color
        sink.enlarged = false; // Reset the enlarged state
        sink.colorChangeTime = null; // Reset the animation timer
      }
    }

    // Draw sink at its fixed position without translation
    ctx.fillStyle = sink.currentColor || "green"; // Default to green if no animation
    ctx.roundRect(
      sink.x * 1,
      (sink.y - sink.height / 2) * 1,
      (sink.width - obstacleRadius * 2) * 1,
      sink.height * 1,
      5 // Border radius                     // Border radius for rounded corners
    );
    ctx.fill();

  };

  const updateBalls = (ctx) => {
    balls.current = balls.current.filter((ball) => {
      ball.vy += gravity;
      ball.x += ball.vx;
      ball.y += ball.vy;

      obstacles.forEach((obstacle) => {
        const dist = Math.hypot(ball.x - obstacle.x, ball.y - obstacle.y);
        if (dist < pad(ball.radius + obstacle.radius)) {
          const angle = Math.atan2(ball.y - obstacle.y, ball.x - obstacle.x);
          const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
          ball.vx = Math.cos(angle) * speed * horizontalFriction;
          ball.vy = Math.sin(angle) * speed * verticalFriction;

          const overlap = ball.radius + obstacle.radius - unpad(dist);
          ball.x += pad(Math.cos(angle) * overlap);
          ball.y += pad(Math.sin(angle) * overlap);
        }
      });

      for (const sink of sinks) {
        if (
          unpad(ball.x) > sink.x - sink.width / 2 &&
          unpad(ball.x) < sink.x + sink.width / 2 &&
          unpad(ball.y) + ball.radius > sink.y - sink.height / 2
        ) {
          printBallDetails(ball, sink.number);
          // Trigger color change animation on sink when ball reaches it
          sink.enlarged = true; // Enable color change
          // Remove the ball from totalballs state
          setTotalBalls((prevTotalBalls) =>
            prevTotalBalls.filter((b) => b !== ball)
          );
          // console.log("Ball removed :", balls.current.length);
          // console.log(balls);
          return false;
        }
      }

      ctx.beginPath();
      ctx.arc(
        unpad(ball.x * 1),
        unpad(ball.y * 1),
        ball.radius * 1,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();

      return true;
    });
  };

  // Function to redraw the canvas
  const draw = () => {
    const canvas = canvasRef.current;
    // console.log("drawing", balls.current.length);
    const ctx = canvas.getContext("2d");
    if(ctx==null){
      window.location.reload();
    }
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawObstacles(ctx);
    drawSinks(ctx);
    updateBalls(ctx);
    fillSinkText(ctx, sinkPattern);
  };

  // Main animation loop
  const animate = () => {
    if (isRunning) {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Initialize obstacles and sinks
  useEffect(() => {
    createobstacle();
    createsink();
    draw();
  }, []);

  // Initialize obstacles and sinks
  useEffect(() => {
    setIsRunning(true);
  }, [isCreate]);

  useEffect(() => {}, [risk]);

  // Start animation loop
  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isRunning]);

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        className="canvas"
        width={HEIGHT}
        height={WIDTH}
      ></canvas>
    </div>
  );
};

export default PlinkoGame;
