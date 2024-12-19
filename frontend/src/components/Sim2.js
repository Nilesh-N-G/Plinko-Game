// import React, { useRef, useEffect ,useState} from "react";
// import '../App.css'


// const DECIMAL_MULTIPLIER = 10000;
// const WIDTH = 600 ;
// const HEIGHT = 600;
// const ballRadius = 7;
// const obstacleRadius = 4;
// const gravity = 0.2 * DECIMAL_MULTIPLIER;
// const horizontalFriction = 0.4;
// const verticalFriction = 0.8;

// const Sim2= () => {
//   const canvasRef = useRef(null);
//   const balls = useRef([]);
//   const obstacles = [];
//   const sinks = [];
//   const [sizeMultiplier, setSizeMultiplier] = useState(0.9);
//   const updateSizeMultiplier = () => {
//     const multiplier = Math.min(window.innerWidth / WIDTH, window.innerHeight / HEIGHT);
//     setSizeMultiplier(multiplier);
//   };

//   useEffect(() => {
//     // Set initial size multiplier
//     updateSizeMultiplier();

//     // Attach resize event listener
//     window.addEventListener("resize", updateSizeMultiplier);

//     // Cleanup event listener on unmount
//     return () => {
//       window.removeEventListener("resize", updateSizeMultiplier);
//     };
//   }, []);
//   const pad = (n) => n * DECIMAL_MULTIPLIER;
//   const unpad = (n) => Math.floor(n / DECIMAL_MULTIPLIER);

//   // Create obstacles in a pyramid shape
//   useEffect(() => {
//     const rows = 16;
//     for (let row = 2; row < rows; row++) {
//       const numObstacles = row + 1;
//       const y = 0 + row * 35;
//       const spacing = 36;
//       for (let col = 0; col < numObstacles; col++) {
//         const x = (WIDTH / 2 - spacing * (row / 2 - col))+30;
//         obstacles.push({ x: pad(x), y: pad(y), radius: obstacleRadius  });
//       }
//     }

//     // Create sinks at the bottom
//     const sinkWidth = 36;
//     const NUM_SINKS = 15;
//     for (let i = 0; i < NUM_SINKS; i++) {
//       const x = ((WIDTH ) / 2 + (i - 7.5) * sinkWidth + obstacleRadius)+30;
//       const y = (HEIGHT ) - 20;
//       sinks.push({ x , y, width: sinkWidth, height: sinkWidth, number: i + 1 });
//     }
//   }, []);

//    const printBallDetails = (ball, sinkNumber) => {
//     const dropPosition = `Ball dropped at position: (${ball.initialX.toFixed(4)}, ${ball.initialY.toFixed(4)})`;
//     const reachedSink = `Ball reached sink #${sinkNumber}`;
//     console.log(dropPosition + ", " + reachedSink);
//   };



//   const addBall = async () => {
//     try {
//       // Make a request to the backend to get the x value
//       const response = await fetch("http://localhost:3000/api/getBallPosition");
//       if (!response.ok) {
//         throw new Error("Failed to fetch ball position from backend");
//       }

//       const { x } = await response.json(); // Assuming the backend returns { x: value }

//       const newBall = {
//         x: pad(x),
//         y: pad(50),
//         initialX: pad(x), // Store unpadded drop position
//         initialY: 50, // Store unpadded drop position (as y is fixed)
//         radius: ballRadius,
//         color: "red",
//         vx: 0,
//         vy: 0,
//       };

//       balls.current.push(newBall);
//       console.log("Ball added:", newBall);
//     } catch (error) {
//       console.error("Error adding ball:", error);
//     }
//   };
  
//   const drawObstacles = (ctx) => {
//     ctx.fillStyle = "white";
//     obstacles.forEach((obstacle) => {
//       ctx.beginPath();
//       ctx.arc(unpad(obstacle.x * sizeMultiplier), unpad(obstacle.y * sizeMultiplier), obstacle.radius * sizeMultiplier, 0, Math.PI * 2);
//       ctx.fill();
//       ctx.closePath();
//     });
//   };
//   const sinkPattern = [
//      9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1,1.2, 1.4, 1.4, 2, 9
//   ];

//   // Add roundRect method to the canvas context
// CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
//     this.beginPath();
//     this.moveTo(x + radius, y);
//     this.lineTo(x + width - radius, y);
//     this.arcTo(x + width, y, x + width, y + height, radius);
//     this.lineTo(x + width, y + height - radius);
//     this.arcTo(x + width, y + height, x + width - radius, y + height, radius);
//     this.lineTo(x + radius, y + height);
//     this.arcTo(x, y + height, x, y + height - radius, radius);
//     this.lineTo(x, y + radius);
//     this.arcTo(x, y, x + radius, y, radius);
//     this.closePath();
//   };
  

  





// // Function to animate sink color change when ball reaches it
// const animateSink = (sink, ctx) => {
//     if (sink.enlarged) {
//       if (!sink.colorChangeTime) {
//         sink.colorChangeTime = Date.now(); // Record the start time of the color change
//       }
  
//       const elapsedTime = Date.now() - sink.colorChangeTime;
//       const duration = 1000; // Duration for color transition in ms
  
//       if (elapsedTime < duration) {
//         // Interpolate the color smoothly from green to red (eased transition)
//         const t = elapsedTime / duration; // Normalize elapsed time from 0 to 1
//         const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  
//         // Color interpolation logic: smooth transition from green (0, 255, 0) to red (255, 0, 0)
//         const r = Math.floor(255 * easedT);
//         const g = Math.floor(255 * (1 - easedT));
//         sink.currentColor = `rgb(${r}, ${g}, 0)`; // Transitioning color
//       } else {
//         // Once the animation is done, reset color and stop the animation
//         sink.currentColor = "green"; // Return to original color
//         sink.enlarged = false;       // Reset the enlarged state
//         sink.colorChangeTime = null; // Reset the animation timer
//       }
//     }
  
//     // Draw sink at its fixed position without translation
//     ctx.fillStyle = sink.currentColor || "green"; // Default to green if no animation
//     ctx.roundRect(
//         sink.x * sizeMultiplier,
//         (sink.y - sink.height / 2)* sizeMultiplier,
//         (sink.width - obstacleRadius * 2)* sizeMultiplier,
//         sink.height* sizeMultiplier,
//         5 // Border radius                     // Border radius for rounded corners
//     );
//     ctx.fill();
  
//     // Draw the sink label (with index as a label)
//     ctx.fillStyle = "white";
//     console.log("sizeMultiplier:", sizeMultiplier);
//     ctx.font = `${Math.floor(sizeMultiplier * 12)}px Arial`;
//     ctx.fillText(sinkPattern[sink.number - 1] + 'x', ((sink.x + 3.5)* sizeMultiplier), ((sink.y + 6)* sizeMultiplier)); // Adjust text positioning
//   };
  
 


// const updateBalls = (ctx) => {
//     balls.current = balls.current.filter((ball) => {
//       ball.vy += gravity;
//       ball.x += ball.vx;
//       ball.y += ball.vy;

//       obstacles.forEach((obstacle) => {
//         const dist = Math.hypot(ball.x - obstacle.x, ball.y - obstacle.y);
//         if (dist < pad(ball.radius + obstacle.radius)) {
//           const angle = Math.atan2(ball.y - obstacle.y, ball.x - obstacle.x);
//           const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
//           ball.vx = Math.cos(angle) * speed * horizontalFriction;
//           ball.vy = Math.sin(angle) * speed * verticalFriction;

//           const overlap = ball.radius + obstacle.radius - unpad(dist);
//           ball.x += pad(Math.cos(angle) * overlap);
//           ball.y += pad(Math.sin(angle) * overlap);
//         }
//       });

//       for (const sink of sinks) {
//         if (
//           unpad(ball.x) > sink.x - sink.width / 2 &&
//           unpad(ball.x) < sink.x + sink.width / 2 &&
//           unpad(ball.y) + ball.radius > sink.y - sink.height / 2
//         ) {
//           printBallDetails(ball, sink.number);
//            // Trigger color change animation on sink when ball reaches it
//            sink.enlarged = true; // Enable color change
//            return false; 
//         }
//       }

//       ctx.beginPath();
//       ctx.arc(unpad(ball.x * sizeMultiplier ), unpad(ball.y * sizeMultiplier), ball.radius  * sizeMultiplier , 0, Math.PI * 2);
//       ctx.fillStyle = ball.color;
//       ctx.fill();
//       ctx.closePath();

//       return true;
//     });
//   };
  

//   const drawSinks = (ctx) => {
//     sinks.forEach((sink) => {
//       // Draw the sink with current color
//       ctx.fillStyle = "green"; // Default color if no animation is active
//       ctx.roundRect(
//         sink.x * sizeMultiplier,
//         (sink.y * sizeMultiplier) - (sink.height * sizeMultiplier) / 2,
//         sink.width * sizeMultiplier - obstacleRadius * 2 * sizeMultiplier,
//         sink.height * sizeMultiplier,
//         5 // Border radius
//       );
//       ctx.fill();
  
//       // Set the color for the text
//       ctx.fillStyle = "black";
//       // console.log("sizeMultiplier:", sizeMultiplier);
//       ctx.font = `${Math.round(sizeMultiplier * 12)}px Arial`;
//       ctx.fillText(sinkPattern[sink.number - 1] + 'x', ((sink.x + 3.5)* sizeMultiplier), ((sink.y + 6)* sizeMultiplier));
      
//       // If the sink is enlarged (color changing), call animateSink for animation
//       if (sink.enlarged) {
//         animateSink(sink, ctx);
//       }
//     });
//   };
  








//   const draw = () => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     ctx.clearRect(0, 0, WIDTH, HEIGHT);
//     drawObstacles(ctx);
//     drawSinks(ctx);
//     updateBalls(ctx);
//   };

//   const gameLoop = () => {
//     draw();
//     requestAnimationFrame(gameLoop);
//   };

//   useEffect(() => {
//     gameLoop();

//     const handleKeyDown = (e) => {
//       if (e.key.toLowerCase() === "b") {
//         addBall();
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

 


//   return (
//     <div className="canvas-container">
//       <canvas
//         ref={canvasRef}
//         className="canvas"
//         width={HEIGHT}
//         height={WIDTH}
//       ></canvas>
//     </div>

//   );
// };

// export default Sim2;
