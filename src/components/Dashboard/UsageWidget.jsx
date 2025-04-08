import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, CircularProgress, Paper, 
  Divider, Chip, LinearProgress, Grid,
  Card, CardContent, Stack
} from '@mui/material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip, Legend
} from 'recharts';
import { dashboardService } from '../../services/api';

// Stili comuni riutilizzabili
const styles = {
  card: {
    borderRadius: 3, 
    borderColor: 'transparent',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    height: '100%'
  },
  cardHeader: {
    fontWeight: 600,
    marginBottom: 2
  },
  container: {
    p: 3, 
    borderRadius: 4, 
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
    mb: 4
  },
  itemBox: {
    p: 1.5,
    borderRadius: 2,
    bgcolor: 'rgba(0,0,0,0.02)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  errorContainer: {
    p: 3, 
    borderRadius: 4, 
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
    mb: 4,
    bgcolor: 'rgba(240, 44, 86, 0.05)'
  }
};

// Palette colori
const COLORS = ['#f02c56', '#7c32ff', '#35a0ee', '#44d7b6', '#ffc658', '#9c71f7', '#fa8231', '#4b7bec'];

// Helper per formattare valori
const formatCurrency = (value) => {
  if (value === undefined || value === null) return '—';
  return `${parseFloat(value).toFixed(2)} €`;
};

// Helper per calcolare la percentuale di utilizzo
const calculateUsagePercentage = (remaining, total) => {
  if (!remaining || !total) return 0;
  const totalInitial = total + remaining;
  return 100 - (remaining / totalInitial) * 100;
};

// Componente per il loader
const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
    <CircularProgress sx={{ color: '#f02c56' }} />
  </Box>
);

// Componente per messaggi di errore
const ErrorMessage = ({ message }) => (
  <Paper sx={styles.errorContainer}>
    <Typography 
      variant="h6" 
      gutterBottom 
      sx={{ 
        fontWeight: 600,
        mb: 2,
        color: '#f02c56'
      }}
    >
      Errore nel recupero dei dati
    </Typography>
    <Typography variant="body1">{message}</Typography>
  </Paper>
);

// Componente per il widget dei crediti
const CreditCard = ({ remainingCredits, remainingDays, totalCostAllTime }) => {
  const usagePercentage = useMemo(() => 
    calculateUsagePercentage(remainingCredits, totalCostAllTime),
    [remainingCredits, totalCostAllTime]
  );

  return (
    <Card variant="outlined" sx={styles.card}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="subtitle1" gutterBottom sx={styles.cardHeader}>
            Crediti Google Cloud
          </Typography>
          
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              {formatCurrency(remainingCredits)}
            </Typography>
            {remainingDays && (
              <Chip 
                label={`${remainingDays} giorni rimanenti`} 
                color="primary" 
                size="small" 
                sx={{
                  bgcolor: 'rgba(124, 50, 255, 0.1)',
                  color: '#7c32ff',
                  border: 'none',
                  ml: 1
                }}
              />
            )}
          </Stack>
          
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, usagePercentage)}
              sx={{ 
                height: 10, 
                borderRadius: 5,
                mb: 1,
                bgcolor: 'rgba(240, 44, 86, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)'
                }
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              {!isNaN(usagePercentage) 
                ? `${usagePercentage.toFixed(1)}% utilizzato` 
                : 'Impossibile calcolare la percentuale'}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// Componente per il riepilogo costi
const CostSummaryCard = ({ 
  totalCost, 
  totalCredits, 
  totalCostAllTime, 
  totalCreditsAllTime 
}) => (
  <Card variant="outlined" sx={styles.card}>
    <CardContent>
      <Stack spacing={2}>
        <Typography variant="subtitle1" gutterBottom sx={styles.cardHeader}>
          Riepilogo Costi
        </Typography>
        
        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Ultimo mese:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {formatCurrency(totalCost)}
            </Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Crediti applicati:</Typography>
            <Typography variant="body2" color="success.main">
              {formatCurrency(totalCredits)}
            </Typography>
          </Stack>
          
          <Divider sx={{ my: 1.5 }} />
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">Da inizio progetto:</Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {formatCurrency(totalCostAllTime)}
            </Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Crediti totali applicati:</Typography>
            <Typography variant="body2" color="success.main">
              {formatCurrency(totalCreditsAllTime)}
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

// Componente per il grafico dei servizi
const ServiceChart = ({ serviceData }) => (
  <Card variant="outlined" sx={styles.card}>
    <CardContent>
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={styles.cardHeader}
      >
        Suddivisione Costi per Servizio
      </Typography>
      
      {serviceData && serviceData.length > 0 ? (
        <Box sx={{ 
          height: 350,
          position: 'relative',
          mx: 'auto',
          width: 350
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={110}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }) => {
                  const RADIAN = Math.PI / 180;
                  const radius = outerRadius * 1.15;
                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                  return (
                    <text 
                      x={x} 
                      y={y} 
                      fill="#333333"
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      fontWeight="bold"
                      fontSize="14"
                    >
                      {`${percentage}%`}
                    </text>
                  );
                }}
                labelLine={true}
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(4)} €`, name]}
                contentStyle={{
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  border: 'none'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: 300,
          bgcolor: 'rgba(0,0,0,0.02)',
          borderRadius: 2,
          p: 3
        }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato di consumo disponibile
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// Componente per i dettagli servizi
const ServiceDetailCard = ({ services }) => (
  <Card variant="outlined" sx={{
    ...styles.card,
    display: 'flex',
    flexDirection: 'column'
  }}>
    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="subtitle1" gutterBottom sx={styles.cardHeader}>
        Dettaglio Servizi
      </Typography>
      
      {services && services.length > 0 ? (
        <Stack spacing={1.5} sx={{ flex: 1, overflow: 'auto', maxHeight: 350 }}>
          {services.map((service, index) => (
            <Box 
              key={index}
              sx={styles.itemBox}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    bgcolor: COLORS[index % COLORS.length],
                    borderRadius: '50%',
                    mr: 1.5,
                    flexShrink: 0
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {service.service}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600, ml: 1 }}>
                {formatCurrency(service.cost)}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'rgba(0,0,0,0.02)',
          display: 'flex',
          justifyContent: 'center',
          flex: 1
        }}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato di servizio disponibile
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

// Componente per le info del progetto
// const ProjectInfo = ({ projectId, billingAccountId }) => (
//   <Box sx={{ 
//     display: 'flex', 
//     justifyContent: 'space-between',
//     mt: 1,
//     px: 1
//   }}>
//     <Typography variant="caption" color="text.secondary">
//       Progetto: {projectId || 'Non disponibile'}
//     </Typography>
//     <Typography variant="caption" color="text.secondary">
//       Account di fatturazione: {billingAccountId || 'Non disponibile'}
//     </Typography>
//   </Box>
// );

// Componente principale
const UsageWidget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingData, setBillingData] = useState(null);
  
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getBillingData();
        setBillingData(data);
        setError(null);
      } catch (err) {
        console.error('Errore nel recupero dei dati di fatturazione:', err);
        setError(`Errore nel recupero dei dati di fatturazione: ${err.message}`);
        setBillingData(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBillingData();
  }, []);
  
  // Prepara i dati per il grafico a torta
  const pieData = useMemo(() => {
    if (!billingData?.serviceBreakdown) return [];
    return billingData.serviceBreakdown
      .filter(item => Math.abs(item.cost) > 0.001)
      .map(item => ({
        name: item.service,
        value: Math.abs(item.cost),
        percentage: item.percentage
      }));
  }, [billingData]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  
  return (
    <Paper sx={styles.container}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 600,
          mb: 2 
        }}
      >
        Monitoraggio Consumi API
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        {/* Prima riga: Crediti rimanenti e Riepilogo costi */}
        <Grid item xs={12} md={6}>
          <CreditCard 
            remainingCredits={billingData?.remainingCredits}
            remainingDays={billingData?.remainingDays}
            totalCostAllTime={billingData?.totalCostAllTime}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <CostSummaryCard 
            totalCost={billingData?.totalCost}
            totalCredits={billingData?.totalCredits}
            totalCostAllTime={billingData?.totalCostAllTime}
            totalCreditsAllTime={billingData?.totalCreditsAllTime}
          />
        </Grid>
        
        {/* Seconda riga: Grafico a torta e Dettaglio Servizi affiancati */}
        <Grid item xs={12} md={7}>
          <ServiceChart serviceData={pieData} />
        </Grid>
        
        <Grid item xs={12} md={5}>
          <ServiceDetailCard services={billingData?.serviceBreakdown} />
        </Grid>
        
        {/* Informazioni progetto */}
        {/* <Grid item xs={12}>
          <ProjectInfo 
            projectId={billingData?.projectId}
            billingAccountId={billingData?.billingAccountId}
          />
        </Grid> */}
      </Grid>
    </Paper>
  );
};

export default UsageWidget; 