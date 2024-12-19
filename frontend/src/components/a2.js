import React, { useRef, useEffect ,useState} from "react";
import '../App.css'


const DECIMAL_MULTIPLIER = 10000;
const WIDTH = 600 ;
const HEIGHT = 600;
const obstacleRadius = 4;
const gravity = 0.2 * DECIMAL_MULTIPLIER;
const horizontalFriction = 0.4;
const verticalFriction = 0.8;

const PlinkoGame = ({balls,sinkPattern}) => {

  const canvasRef = useRef(null);



  const obstacles = [];
  const sinks = [];
  const [sizeMultiplier, setSizeMultiplier] = useState(0.9);
  const updateSizeMultiplier = () => {
    console.log('Update size');
    const multiplier = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
    setSizeMultiplier(multiplier);
  };

  useEffect(() => {
    // Set initial size multiplier
    updateSizeMultiplier();

    // Attach resize event listener
    window.addEventListener("resize", updateSizeMultiplier);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener("resize", updateSizeMultiplier);
    };
  }, []);



  useEffect(() => {
    console.log("Risk or sink pattern changed, stopping the loop and clearing canvas.");
  }, [sinkPattern]);  
  



  const pad = (n) => n * DECIMAL_MULTIPLIER;
  const unpad = (n) => Math.floor(n / DECIMAL_MULTIPLIER);
  const createsink= () => {
    console.log('creating sinks');
    const sinkWidth = 36;
    const NUM_SINKS = 15;
    for (let i = 0; i < NUM_SINKS; i++) {
      const x = (WIDTH ) / 2 + (i - 7.5) * sinkWidth + obstacleRadius;
      const y = (HEIGHT ) - 45;
      sinks.push({ x , y, width: sinkWidth, height: sinkWidth, number: i + 1,sinkValue: sinkPattern[i]});
    }
  }

  // Create obstacles in a pyramid shape
  useEffect(() => {
    const rows = 16;
    for (let row = 2; row < rows; row++) {
      const numObstacles = row + 1;
      const y = 0 + row * 35;
      const spacing = 36;
      for (let col = 0; col < numObstacles; col++) {
        const x = WIDTH / 2 - spacing * (row / 2 - col);
        obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius  });
      }
    }

   createsink();

    console.log("Done");
  }, [sinkPattern]);

  // This function will print both the drop position and the sink number when a ball reaches a sink
  const printBallDetails = (ball, sinkNumber) => {
    const dropPosition = `Ball dropped at position: (${ball.initialX.toFixed(4)}, ${ball.initialY.toFixed(4)})`;
    const reachedSink = `Ball reached sink #${sinkNumber}`;
    console.log(dropPosition + ", " + reachedSink+'With Multiplier '+ball.multiplier);
  };


  

  const drawObstacles = (ctx) => {
    
    ctx.fillStyle = "white";
    obstacles.forEach((obstacle) => {
      ctx.beginPath();
      ctx.arc(unpad(obstacle.x * sizeMultiplier), unpad(obstacle.y * sizeMultiplier), obstacle.radius * sizeMultiplier, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    });
  };


  // Add roundRect method to the canvas context
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
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
        sink.enlarged = false;       // Reset the enlarged state
        sink.colorChangeTime = null; // Reset the animation timer
      }
    }
  
    // Draw sink at its fixed position without translation
    ctx.fillStyle = sink.currentColor || "green"; // Default to green if no animation
    ctx.roundRect(
        sink.x * sizeMultiplier,
        (sink.y - sink.height / 2)* sizeMultiplier,
        (sink.width - obstacleRadius * 2)* sizeMultiplier,
        sink.height* sizeMultiplier,
        5 // Border radius                     // Border radius for rounded corners
    );
    ctx.fill();
  
    // Draw the sink label (with index as a label)
    ctx.fillStyle = "white";
    console.log("sizeMultiplier:", sizeMultiplier);
    ctx.font = `${Math.floor(sizeMultiplier * 12)}px Arial`;
    ctx.fillText(sinkPattern[sink.number - 1] + 'x', ((sink.x + 3.5)* sizeMultiplier), ((sink.y + 6)* sizeMultiplier)); // Adjust text positioning
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
           console.log(balls);
           return false; 
        }
      }

      ctx.beginPath();
      ctx.arc(unpad(ball.x * sizeMultiplier ), unpad(ball.y * sizeMultiplier), ball.radius  * sizeMultiplier , 0, Math.PI * 2);
      ctx.fillStyle = ball.color;
      ctx.fill();
      ctx.closePath();

      return true;
    });
  };
  
  const drawSinks = (ctx) => {
    // Determine the center sink index
    const centerIndex = Math.floor(sinks.length / 2);
    const totalSinks = sinks.length;
  
    sinks.forEach((sink, index) => {
      // console.log(sink.sinkValue)
      // Calculate color based on position
      let red = 0, green = 0, blue = 0;
  
      if (index < centerIndex) {
        // Gradual transition from orange to yellow for left sinks
        const t = index / centerIndex;
        red = Math.round(255 * (1 - t) + 255 * t); // Transition red (orange to yellow)
        green = Math.round(120 * (1 - t) + 255 * t); // Transition green (orange to yellow)
        blue = 0; // Both orange and yellow have no blue component
      } else if (index === centerIndex) {
        // Center sinks are yellow
        red = 255;
        green = 255;
        blue = 0;
      } else {
        // Gradual transition from yellow to orange for right sinks
        const t = (index - centerIndex) / (totalSinks - centerIndex - 1);
        red = Math.round(255 * (1 - t) + 255 * t); // Transition red (yellow to orange)
        green = Math.round(255 * (1 - t) + 120 * t); // Transition green (yellow to orange)
        blue = 0; // Both orange and yellow have no blue component
      }
  
      // Convert RGB to CSS color format
      ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
  
      // Draw the sink rectangle
      ctx.roundRect(
        sink.x * sizeMultiplier,
        sink.y * sizeMultiplier - (sink.height * sizeMultiplier) / 2,
        sink.width * sizeMultiplier - obstacleRadius * 2 * sizeMultiplier,
        sink.height * sizeMultiplier,
        5 // Border radius
      );
      ctx.fill();
  
      // Set the color for the text
      ctx.fillStyle = "black";
      ctx.font = `${Math.round(sizeMultiplier * 12)}px Arial`;
      ctx.fillText(
        sinkPattern[sink.number - 1] + "x",
        (sink.x + 3.5) * sizeMultiplier,
        (sink.y + 6) * sizeMultiplier
      );
      
  
      // If the sink is enlarged (color changing), call animateSink for animation
      if (sink.enlarged) {
        animateSink(sink, ctx);
      }
    });
  };
  









  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    console.log("drawing canvas");

    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    drawObstacles(ctx);
    drawSinks(ctx);
    updateBalls(ctx);
  };

  const gameLoop = () => {
    draw();
    requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    gameLoop();
    // draw();

  }, []);






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
