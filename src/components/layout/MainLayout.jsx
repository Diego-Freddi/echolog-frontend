import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Mic as MicIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const MainLayout = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Registra', icon: <MicIcon />, path: '/record' },
    { text: 'Cronologia', icon: <HistoryIcon />, path: '/history' },
    { text: 'Profilo', icon: <PersonIcon />, path: '/profile' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: 1300,
          background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)',
          boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar sx={{ padding: '12px 24px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ 
              mr: 2, 
              ...(open && { display: 'none' }),
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' },
              borderRadius: '12px',
              padding: '8px'
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: '-0.01em'
            }}
          >
            EchoLog
          </Typography>
          {user && (
            <>
              <IconButton
                onClick={handleMenuOpen}
                sx={{ 
                  padding: 0.5,
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'all 0.2s ease-in-out'
                }}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <Avatar
                  alt={user.name}
                  src={user.picture}
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid rgba(255,255,255,0.2)'
                  }}
                />
              </IconButton>
              <Menu
                id="profile-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    mt: 1,
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(240,44,86,0.1)'
                  }
                }}
              >
                <MenuItem 
                  onClick={() => navigate('/profile')}
                  sx={{ 
                    borderRadius: '8px', 
                    mx: 1, 
                    my: 0.5,
                    '&:hover': { backgroundColor: 'rgba(240,44,86,0.05)' }
                  }}
                >
                  <ListItemIcon>
                    <PersonIcon fontSize="small" sx={{ color: '#f02c56' }} />
                  </ListItemIcon>
                  <ListItemText primary="Profilo" />
                </MenuItem>
                <Divider sx={{ my: 1 }} />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    borderRadius: '8px', 
                    mx: 1, 
                    my: 0.5,
                    '&:hover': { backgroundColor: 'rgba(240,44,86,0.05)' }
                  }}
                >
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" sx={{ color: '#f02c56' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(240,44,86,0.1)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.05)'
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'flex-end',
          padding: '12px 8px',
          borderBottom: '1px solid rgba(240,44,86,0.1)'
        }}>
          <IconButton 
            onClick={handleDrawerClose}
            sx={{
              backgroundColor: 'rgba(240,44,86,0.05)',
              '&:hover': { backgroundColor: 'rgba(240,44,86,0.1)' },
              borderRadius: '12px',
              padding: '8px'
            }}
          >
            <ChevronLeftIcon sx={{ color: '#f02c56' }} />
          </IconButton>
        </Box>

        <List sx={{ p: 2 }}>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: '12px',
                mb: 1,
                '&:hover': { 
                  backgroundColor: 'rgba(240,44,86,0.05)',
                },
                '& .MuiListItemIcon-root': {
                  color: '#f02c56'
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{
                  sx: { fontWeight: 500 }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginLeft: open ? `${drawerWidth}px` : 0,
          transition: 'margin 0.3s ease-in-out',
          mt: '64px'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 