// Import necessary modules and components
import React, { useEffect ,useState} from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { styled } from '@mui/system';
import axios from 'axios';
// Custom styled components
const Background = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  backgroundImage: 'radial-gradient(circle, rgb(19, 51, 109) 0%, rgb(17, 82, 194) 100%)',
  backgroundSize: '200% 200%',
  animation: 'waterFlow 6s linear infinite',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#ff6f61',
  color: '#fff',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  padding: '12px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#ff856d',
    boxShadow: '0px 12px 20px rgba(0, 0, 0, 0.3)',
  },
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.15)',
  borderRadius: '16px',
  padding: '40px 20px',
  backdropFilter: 'blur(10px)',
  boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
  color: '#fff',
  textAlign: 'center',
  margin: '0 auto',
  maxWidth: '600px',
}));

const Homepage = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const ballContainer = document.getElementById('ball-container');

    // Create a <style> element for keyframes
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      @keyframes moveBall {
        0% { transform: translateY(0px) translateX(0px); }
        50% { transform: translateY(100vh) translateX(-20vw); }
        100% { transform: translateY(0px) translateX(20vw); }
      }

      @keyframes waterFlow {
        0% { background-position: 0% 0%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 100%; }
      }
    `;
    document.head.appendChild(styleElement);

    // Generate balls dynamically
    const colors = ['rgba(255, 0, 0, 0.5)', 'rgba(0, 255, 0, 0.5)', 'rgba(0, 0, 255, 0.5)', 'rgba(255, 255, 0, 0.5)', 'rgba(255, 0, 255, 0.5)', 'rgba(0, 255, 255, 0.5)'];
    for (let i = 0; i < 20; i++) {
      const ball = document.createElement('div');
      ball.style.position = 'absolute';
      ball.style.width = '20px';
      ball.style.height = '20px';
      ball.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      ball.style.borderRadius = '50%';
      ball.style.top = `${Math.random() * 100}vh`;
      ball.style.left = `${Math.random() * 100}vw`;
      ball.style.animation = `moveBall ${Math.random() * 5 + 5}s linear infinite`;

      ballContainer.appendChild(ball);
    }

    return () => {
      ballContainer.innerHTML = ''; // Cleanup balls
      document.head.removeChild(styleElement); // Remove keyframes
    };
  }, []);


    // Google Login Handler
    const handleGoogleLogin = async () => {
      setLoading(true);
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
  
      try {

        const status = await axios.get("http://localhost:3000/health",{});
        console.log('Health check successful',status.status);
        if(status.status === 200) {
          await signInWithPopup(auth, provider);
          const token = await auth.currentUser.getIdToken(true);
          console.log(token);
          const response = await axios.post("http://localhost:3000/login",{}, {
            headers: {
              Authorization: `Bearer ${token}`, // Set the Authorization header
            },
          });
          console.log('Login Successful',response.data.success);
        }
        else{
          console.error('Health check failed',status.status);
          alert('Server is not responding. Please try again later.');
        }
 
        
      } catch (error) {
        console.error('Login Error:', error.message);
        alert('Server is not responding. Please try again later.');
      }
      setLoading(false);
    };

  return (
    <Background>
      <Box id="ball-container" style={{ position: 'absolute', width: '100%', height: '100%' }}></Box>
      <StyledContainer sx={{marginX:'10px'}}>
        <Typography variant="h3" style={{ fontWeight: 'bold', marginBottom: '20px' }}>
          Welcome to Plinko Game
        </Typography>
        <Typography variant="h6" style={{ marginBottom: '30px', lineHeight: '1.6' }}>
          Experience the thrill of the ultimate Plinko challenge! Sign in and get started on your journey to fun and rewards.
        </Typography>
        <StyledButton onClick={handleGoogleLogin}>Get Started</StyledButton>
      </StyledContainer>
    </Background>
  );
};

export default Homepage;
