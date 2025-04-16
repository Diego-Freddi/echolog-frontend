import React, { useState, useEffect, useMemo } from 'react';
import { 
  Box, Typography, CircularProgress, Paper, 
  Divider, Chip, LinearProgress, Grid,
  Card, CardContent, Stack
} from '@mui/material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { dashboardService } from '../../services/api';
import { COLORS } from '../../styles/themes';
import styles, {
  CHART_COLORS,
  loadingSpinnerStyles,
  creditCardStyles,
  serviceChartStyles,
  serviceDetailStyles
} from '../../styles/usageWidgetStyles';

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
  <Box sx={loadingSpinnerStyles.container}>
    <CircularProgress sx={loadingSpinnerStyles.spinner} />
  </Box>
);

// Componente per messaggi di errore
const ErrorMessage = ({ message }) => (
  <Paper sx={styles.errorContainer}>
    <Typography 
      variant="h6" 
      gutterBottom 
      sx={{ 
        fontWeight: 'semibold',
        mb: 1,
        color: COLORS.primary.main
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
      <CardContent sx={creditCardStyles.cardContent}>
        <Stack spacing={2}>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={styles.cardHeader}
          >
            Crediti Google Cloud
          </Typography>
          
          <Stack spacing={1}>
            <Typography 
              variant="h3" 
              sx={creditCardStyles.creditAmount}
            >
              {formatCurrency(remainingCredits)}
            </Typography>
            {remainingDays && (
              <Chip 
                label={`${remainingDays} giorni rimanenti`} 
                color="primary" 
                size="small" 
                sx={creditCardStyles.daysChip}
              />
            )}
          </Stack>
          
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(100, usagePercentage)}
              sx={creditCardStyles.progressBar} 
            />
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={creditCardStyles.progressText}
            >
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
            <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
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
            <Typography variant="h6" sx={{ fontWeight: 'semibold' }}>
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
        <Box sx={serviceChartStyles.container}>
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
                      textAnchor={x > cx ? 'start' : 'end'} 
                      dominantBaseline="central"
                      sx={serviceChartStyles.percentageLabel}
                    >
                      {`${percentage}%`}
                    </text>
                  );
                }}
                labelLine={true}
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [`${value.toFixed(4)} €`, name]}
                contentStyle={serviceChartStyles.tooltipStyle}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      ) : (
        <Box sx={serviceChartStyles.noDataContainer}>
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
    <CardContent sx={serviceDetailStyles.container}>
      <Typography 
        variant="subtitle1" 
        gutterBottom 
        sx={styles.cardHeader}
      >
        Dettaglio Servizi
      </Typography>
      
      {services && services.length > 0 ? (
        <Stack spacing={{ xs: 2, sm: 1.5 }} sx={serviceDetailStyles.list}>
          {services.map((service, index) => (
            <Box 
              key={index}
              sx={{
                ...styles.itemBox,
                ...serviceDetailStyles.itemBox
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: '70%' }}>
                <Box
                  sx={{
                    ...serviceDetailStyles.colorDot,
                    bgcolor: CHART_COLORS[index % CHART_COLORS.length]
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={serviceDetailStyles.serviceName}
                >
                  {service.service}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={serviceDetailStyles.serviceCost}
              >
                {formatCurrency(service.cost)}
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={serviceDetailStyles.noDataBox}>
          <Typography variant="body2" color="text.secondary">
            Nessun dato di servizio disponibile
          </Typography>
        </Box>
      )}
    </CardContent>
  </Card>
);

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
        sx={styles.mainTitle}
      >
        Monitoraggio Consumi API
      </Typography>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={3}>
        {/* Prima riga: Crediti rimanenti */}
        <Grid item xs={12} md={6}>
          <CreditCard 
            remainingCredits={billingData?.remainingCredits}
            remainingDays={billingData?.remainingDays}
            totalCostAllTime={billingData?.totalCostAllTime}
          />
        </Grid>
        
        {/* Seconda riga: Riepilogo costi - visibile solo su desktop */}
        <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
          <CostSummaryCard 
            totalCost={billingData?.totalCost}
            totalCredits={billingData?.totalCredits}
            totalCostAllTime={billingData?.totalCostAllTime}
            totalCreditsAllTime={billingData?.totalCreditsAllTime}
          />
        </Grid>
        
        {/* Terza riga: Grafico a torta - visibile solo su desktop */}
        <Grid item xs={12} md={7} sx={{ display: { xs: 'none', md: 'block' } }}>
          <ServiceChart serviceData={pieData} />
        </Grid>
        
        {/* Quarta riga: Dettaglio Servizi */}
        <Grid item xs={12} md={5}>
          <ServiceDetailCard services={billingData?.serviceBreakdown} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UsageWidget; 