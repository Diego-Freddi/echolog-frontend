import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Container,
  Stack,
  Tooltip
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeMode } from '../../contexts/ThemeContext';
import { 
  Logout as LogoutIcon, 
  Person as PersonIcon, 
  Dashboard as DashboardIcon, 
  Mic as MicIcon, 
  Description as DescriptionIcon, 
  History as HistoryIcon, 
  MonetizationOn as MonetizationOnIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon
} from '@mui/icons-material';
import { BORDERS } from '../../styles/themes';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useThemeMode();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    navigate('/login');
  };

  // Definizione delle voci di menu
  const menuItems = [
    { label: 'Dashboard', path: '/', icon: <DashboardIcon /> },
    { label: 'Registrazione', path: '/record', icon: <MicIcon /> },
    { label: 'Text Analyzer', path: '/text-analyzer', icon: <DescriptionIcon /> },
    { label: 'Cronologia', path: '/history', icon: <HistoryIcon /> },
    { label: 'Consumi', path: '/usage', icon: <MonetizationOnIcon /> }
  ];

  return (
    <AppBar 
      position="static" 
      sx={{ 
        background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
        boxShadow: 'none'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0, sm: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Link to="/" style={{ 
              color: 'white', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center' 
            }}>
              <img 
                src="/EchoLog-Logo-Bianco-512x143.png" 
                alt="EchoLog Logo" 
                style={{ 
                  height: '32px',
                  width: 'auto',
                  marginRight: '16px'
                }} 
              />
            </Link>
          </Box>

          {user && (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography 
                variant="body1" 
                sx={{ 
                  color: 'white',
                  opacity: 0.9,
                  fontWeight: 500,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Ciao, {user.name}
              </Typography>

              {/* Pulsante toggle tema */}
              <Tooltip title={mode === 'light' ? 'Modalità scura' : 'Modalità chiara'}>
                <IconButton
                  onClick={toggleColorMode}
                  sx={{
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.2)',
                    '&:hover': {
                      border: '2px solid rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>

              <IconButton
                size="large"
                onClick={handleMenu}
                sx={{ 
                  padding: 0.5,
                  border: '2px solid rgba(255,255,255,0.2)',
                  '&:hover': {
                    border: '2px solid rgba(255,255,255,0.3)'
                  }
                }}
              >
                <img 
                  src={user.picture} 
                  alt={user.name} 
                  style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: BORDERS.radius.round,
                    objectFit: 'cover'
                  }} 
                />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(240,44,86,0.1)',
                    borderRadius: BORDERS.radius.sm,
                    minWidth: 200
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Profilo</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 