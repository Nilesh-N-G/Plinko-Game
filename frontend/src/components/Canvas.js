// import React, { useRef, useEffect, useState } from 'react';
// import Ball from './Ball';

// const Canvas = () => {
//   const canvasRef = useRef(null);
//   const [balls, setBalls] = useState([]);
//   const DECIMAL_MULTIPLIER = 10000;

//   const pad = (n) => n * DECIMAL_MULTIPLIER;
//   const unpad = (n) => Math.floor(n / DECIMAL_MULTIPLIER);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     // Set initial canvas size to parent container
//     const resizeCanvas = () => {
//       const parent = canvas.parentElement;
//       canvas.width = parent.offsetWidth;
//       canvas.height = parent.offsetHeight;
//     };

//     resizeCanvas();
//     window.addEventListener('resize', resizeCanvas);

//     const ballRadius = 7;
//     const gravity = pad(0.2);
//     const horizontalFriction = 0.4;
//     const verticalFriction = 0.8;

//     const obstacles = [];
//     const sinks = [];

//     const generateObstaclesAndSinks = () => {
//       const WIDTH = canvas.width;
//       const HEIGHT = canvas.height;

//       // Clear previous data
//       obstacles.length = 0;
//       sinks.length = 0;

//       // Generate obstacles in a pyramid shape
//       const rows = 16;
//       for (let row = 2; row < rows; row++) {
//         const numObstacles = row + 1;
//         const y = 0 + row * 35;
//         const spacing = 36;
//         for (let col = 0; col < numObstacles; col++) {
//           const x = WIDTH / 2 - spacing * (row / 2 - col);
//           obstacles.push({ x: pad(x), y: pad(y), radius: 4 });
//         }
//       }

//       // Generate sinks
//       const sinkWidth = 36;
//       const NUM_SINKS = 15;
//       for (let i = 0; i < NUM_SINKS; i++) {
//         const x = WIDTH / 2 + (i - 7.5) * sinkWidth + 4;
//         const y = HEIGHT - 240;
//         sinks.push({ x, y, width: sinkWidth, height: sinkWidth });
//       }
//     };

//     generateObstaclesAndSinks();

//     const drawObstacles = () => {
//       ctx.fillStyle = 'white';
//       obstacles.forEach((obstacle) => {
//         ctx.beginPath();
//         ctx.arc(unpad(obstacle.x), unpad(obstacle.y), obstacle.radius, 0, Math.PI * 2);
//         ctx.fill();
//         ctx.closePath();
//       });
//     };

//     const drawSinks = () => {
//       ctx.fillStyle = 'green';
//       sinks.forEach((sink) => {
//         ctx.fillRect(
//           sink.x,
//           sink.y - sink.height / 2,
//           sink.width - 4 * 2,
//           sink.height
//         );
//       });
//     };

//     const updateBalls = () => {
//       balls.forEach((ball) => {
//         ball.update(obstacles, sinks, gravity, horizontalFriction, verticalFriction, unpad, pad);
//       });
//     };

//     const drawBalls = () => {
//       balls.forEach((ball) => ball.draw(ctx, unpad));
//     };

//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       drawObstacles();
//       drawSinks();
//       drawBalls();
//     };

//     const update = () => {
//       updateBalls();
//       draw();
//       requestAnimationFrame(update);
//     };

//     update();

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, [balls]);

//   const addBall = () => {
//     const canvas = canvasRef.current;
//     const newBall = new Ball(pad(canvas.width / 2 + 23), pad(50), 7, 'red');
//     setBalls((prevBalls) => [...prevBalls, newBall]);
//   };

//   return (
//     <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//       <canvas
//         ref={canvasRef}
//         style={{ display: 'block', backgroundColor: '#000' }}
//       ></canvas>
//       <button
//         onClick={addBall}
//         style={{
//           position: 'absolute',
//           top: '10px',
//           right: '10px',
//           backgroundColor: '#0f0',
//           padding: '10px',
//           cursor: 'pointer',
//         }}
//       >
//         Add Ball
//       </button>
//     </div>
//   );
// };

// export default Canvas;
