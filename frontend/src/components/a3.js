import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

const NavBar = () => {
  return (
    <AppBar
      position="sticky" // Makes the navbar sticky
      sx={{ backgroundColor: '#2c3e50', top: 0, zIndex: 1100,padding:1 }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontFamily: "'Pacifico', cursive",
            color: '#fff',
            fontSize: '24px',
          }}
        >
          Plinko
        </Typography>

        {/* Center Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            backgroundColor: '#34495e',
            padding: '4px 8px',
            borderRadius: '8px',
            height:{
              sm:30,
              md:50,
            }
          }}
        >
          <Typography
            variant="body1"
            component="div"
            sx={{ color: '#fff', fontSize: '20px' }}
          >
            <CurrencyRupeeIcon sx={{fontSize:20}}/> 0.38
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#3b82f6',
              color: '#fff',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#2563eb' },
              marginLeft: 1
            }}
          >
            Add
          </Button>
        </Box>

        {/* Empty Box for Right Spacing */}
        <Box sx={{ width: '48px' }} />
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
