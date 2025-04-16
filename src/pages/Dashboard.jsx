import React from 'react';
import { Box, Typography, Paper, Container, Button } from '@mui/material';
import { 
    Mic as MicIcon, 
    History as HistoryIcon, 
    MonetizationOn as MonetizationOnIcon,
    Description as DescriptionIcon 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PageContainer from '../components/layout/PageContainer';
import { AppleCard, GradientButton, buttonStyles } from '../styles/pageStyles';
import { BORDERS, SHADOWS } from '../styles/themes';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const cardStyle = {
        p: 4,
        height: 320,
        width: '100%',
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: BORDERS.radius.md,
        boxShadow: SHADOWS.md,
        border: '1px solid rgba(240,44,86,0.1)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: SHADOWS.lg
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

    return (
        <PageContainer sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh' }}>
            <Container maxWidth="lg" sx={{ 
                position: 'relative',
                py: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
            }}>
                {/* Watermark Logo */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 0,
                        opacity: 0.3,
                        pointerEvents: 'none',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <img
                        src="/EchoLog-Logo-512x143.png"
                        alt="EchoLog Watermark"
                        style={{
                            width: '100%',
                            maxWidth: '1500px',
                            height: 'auto'
                        }}
                    />
                </Box>

                {/* Widget Container */}
                <Box
                    sx={{
                        width: '100%',
                        maxWidth: '900px',
                        position: 'relative',
                        zIndex: 1,
                        my: 'auto'
                    }}
                >
                    {/* Widget Grid */}
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(280px, 340px))' },
                        gap: { xs: 3, sm: 2.5 },
                        width: '100%',
                        justifyContent: 'center'
                    }}>
                        {/* Nuova Registrazione */}
                        <Paper sx={cardStyle} onClick={() => navigate('/record')}>
                            <Box sx={contentStyle}>
                                <MicIcon sx={{ fontSize: 48, color: '#f02c56', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Nuova Registrazione
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Registra e trascrivi audio con un click
                                </Typography>
                            </Box>
                            <GradientButton
                                startIcon={<MicIcon />}
                            >
                                Registra Ora
                            </GradientButton>
                        </Paper>

                        {/* Text Analyzer */}
                        <Paper sx={cardStyle} onClick={() => navigate('/text-analyzer')}>
                            <Box sx={contentStyle}>
                                <DescriptionIcon sx={{ fontSize: 48, color: '#35a0ee', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Text Analyzer
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Analizza testo da file o input diretto
                                </Typography>
                            </Box>
                            <GradientButton
                                startIcon={<DescriptionIcon />}
                            >
                                Analizza Testo
                            </GradientButton>
                        </Paper>

                        {/* Cronologia */}
                        <Paper sx={cardStyle} onClick={() => navigate('/history')}>
                            <Box sx={contentStyle}>
                                <HistoryIcon sx={{ fontSize: 48, color: '#7c32ff', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Cronologia
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Accedi alle tue registrazioni passate
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{
                                    ...buttonStyles.secondary,
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

                        {/* Consumi */}
                        <Paper sx={cardStyle} onClick={() => navigate('/usage')}>
                            <Box sx={contentStyle}>
                                <MonetizationOnIcon sx={{ fontSize: 48, color: '#35a0ee', mb: 3 }} />
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Consumi
                                </Typography>
                                <Typography color="text.secondary" align="center">
                                    Monitora l'utilizzo dei servizi
                                </Typography>
                            </Box>
                            <Button
                                variant="outlined"
                                sx={{
                                    ...buttonStyles.secondary,
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
                    </Box>
                </Box>
            </Container>
        </PageContainer>
    );
};

export default Dashboard; 