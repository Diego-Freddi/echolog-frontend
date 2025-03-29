import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import MicIcon from '@mui/icons-material/Mic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
        boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ padding: '12px 0' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              fontWeight: 600, 
              fontSize: '1.25rem',
              letterSpacing: '-0.01em'
            }}
          >
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                padding: '8px 12px', 
                borderRadius: '12px', 
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <MicIcon />
              </span>
              Registratore Audio
            </Link>
          </Typography>

          {user ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                sx={{ 
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                  padding: '8px'
                }}
              >
                <AccountCircleIcon sx={{ color: 'white' }} />
              </IconButton>
            </Box>
          ) : (
            <Button 
              color="inherit" 
              component={Link} 
              to="/login"
              startIcon={<GoogleIcon />}
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.1)', 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
                borderRadius: '12px',
                padding: '8px 20px',
                textTransform: 'none',
                fontWeight: 500
              }}
            >
              Accedi con Google
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 