import React from 'react';
import { Box, Typography, Paper, Grid, Button } from '@mui/material';
import { Mic as MicIcon, History as HistoryIcon, MonetizationOn as MonetizationOnIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const cardStyle = {
        p: 4,
        height: 320,
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: '1px solid rgba(240,44,86,0.1)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        mx: 'auto',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 48px rgba(0,0,0,0.12)'
        },
        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 50%, #35a0ee 100%)'
        }
    };

    const contentStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        mb: 3
    };

    const buttonStyle = {
        width: '100%',
        maxWidth: 280,
        py: 1.5,
        borderRadius: '12px',
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 500,
        boxShadow: 'none',
        '&:hover': {
            boxShadow: 'none'
        }
    };

    return (
        <PageContainer>
            <Box sx={{ position: 'relative', minHeight: '100vh' }}>
                {/* Watermark Logo */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 0,
                        opacity: 0.3,
                        pointerEvents: 'none',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <img
                        src="/EchoLog-Logo-512x143.png"
                        alt="EchoLog Watermark"
                        style={{
                            width: '90%',
                            maxWidth: '1000px',
                            height: 'auto'
                        }}
                    />
                </Box>

                {/* Widgets */}
                <Grid 
                    container 
                    spacing={4} 
                    justifyContent="center"
                    sx={{ 
                        mt: { xs: 2, sm: 4 },
                        position: 'relative',
                        zIndex: 1
                    }}
                >
                    <Grid item>
                        <Paper sx={cardStyle} onClick={() => navigate('/record')}>
                            <Box sx={contentStyle}>
                                <MicIcon sx={{ fontSize: 48, color: '#f02c56', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                    Nuova Registrazione
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Registra e trascrivi audio con un click
                                </Typography>
                            </Box>
                            <Button
                                variant="contained"
                                sx={{
                                    ...buttonStyle,
                                    background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(90deg, #e02951 0%, #6c2be0 100%)'
                                    }
                                }}
                                startIcon={<MicIcon />}
                            >
                                Registra Ora
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper sx={cardStyle} onClick={() => navigate('/history')}>
                            <Box sx={contentStyle}>
                                <HistoryIcon sx={{ fontSize: 48, color: '#7c32ff', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                    Cronologia
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Accedi alle tue registrazioni passate
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{
                                    ...buttonStyle,
                                    borderColor: '#7c32ff',
                                    color: '#7c32ff',
                                    '&:hover': {
                                        borderColor: '#6c2be0',
                                        background: 'rgba(124,50,255,0.05)'
                                    }
                                }}
                                startIcon={<HistoryIcon />}
                            >
                                Vedi Cronologia
                            </Button>
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper sx={cardStyle} onClick={() => navigate('/usage')}>
                            <Box sx={contentStyle}>
                                <MonetizationOnIcon sx={{ fontSize: 48, color: '#35a0ee', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                                    Consumi
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Monitora l'utilizzo dei servizi
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{
                                    ...buttonStyle,
                                    borderColor: '#35a0ee',
                                    color: '#35a0ee',
                                    '&:hover': {
                                        borderColor: '#2e8ed4',
                                        background: 'rgba(53,160,238,0.05)'
                                    }
                                }}
                                startIcon={<MonetizationOnIcon />}
                            >
                                Vedi Consumi
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    );
};

export default Dashboard; 