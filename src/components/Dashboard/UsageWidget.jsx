import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, CircularProgress, Paper, 
  Divider, Chip, LinearProgress, Grid
} from '@mui/material';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  Tooltip
} from 'recharts';
import { dashboardService } from '../../services/api';

const UsageWidget = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingData, setBillingData] = useState(null);
  
  // Colori per il grafico a torta
  const COLORS = ['#f02c56', '#7c32ff', '#35a0ee', '#44d7b6', '#ffc658'];
  
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
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress sx={{ color: '#f02c56' }} />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Paper sx={{ 
        p: 3, 
        borderRadius: 4, 
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
        mb: 4,
        bgcolor: 'rgba(240, 44, 86, 0.05)'
      }}>
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
        <Typography variant="body1">{error}</Typography>
      </Paper>
    );
  }
  
  // Prepara i dati per il grafico a torta
  const pieData = billingData?.serviceBreakdown
    .filter(item => Math.abs(item.cost) > 0.001) // Filtra servizi con costi minimi
    .map(item => ({
      name: item.service,
      value: Math.abs(item.cost),
      percentage: item.percentage
    })) || [];
  
  // Calcola la percentuale di utilizzo dei crediti
  const creditPercentage = billingData && billingData.remainingCredits !== null ? 
    Math.abs(billingData.totalCredits) / billingData.remainingCredits * 100 : 0;
  
  return (
    <Paper sx={{ 
      p: 3, 
      borderRadius: 4, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
      mb: 4
    }}>
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
        {/* Informazioni sui crediti */}
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Crediti Google Cloud
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mr: 1 }}>
                {billingData?.remainingCredits !== null ? 
                  `${billingData?.remainingCredits.toFixed(2)} €` : 
                  'Dati non disponibili'}
              </Typography>
              {billingData?.remainingDays !== null ? (
                <Chip 
                  label={`${billingData?.remainingDays} giorni rimanenti`} 
                  color="primary" 
                  size="small" 
                  sx={{
                    bgcolor: 'rgba(124, 50, 255, 0.1)',
                    color: '#7c32ff',
                    border: 'none'
                  }}
                />
              ) : (
                <Chip 
                  label="Giorni non disponibili" 
                  color="error" 
                  size="small" 
                  sx={{
                    bgcolor: 'rgba(240, 44, 86, 0.1)',
                    color: '#f02c56',
                    border: 'none'
                  }}
                />
              )}
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={billingData?.remainingCredits !== null ? Number(creditPercentage) : 0}
              sx={{ 
                height: 8, 
                borderRadius: 4,
                mb: 1,
                bgcolor: 'rgba(240, 44, 86, 0.1)',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #f02c56 0%, #7c32ff 100%)'
                }
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              {billingData?.remainingCredits !== null 
                ? `${creditPercentage.toFixed(2)}% dei crediti utilizzati` 
                : 'Impossibile calcolare la percentuale - dati mancanti'}
            </Typography>
          </Box>
          
          {/* Costi netti */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Costi Totali (Ultimo mese)
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mr: 1 }}>
                {billingData?.totalCost !== undefined && billingData?.totalCost !== null ? 
                  `${billingData?.totalCost.toFixed(2)} €` : 
                  'Dati non disponibili'}
              </Typography>
              {billingData?.totalCredits !== undefined && billingData?.totalCredits !== null ? (
                <Typography 
                  variant="body2" 
                  color="success.main" 
                  sx={{ mb: 0.5 }}
                >
                  ({Math.abs(billingData?.totalCredits).toFixed(2)} € in crediti)
                </Typography>
              ) : null}
            </Box>
            <Typography variant="body2" color="text.secondary">
              Costo netto: {billingData?.netCost !== undefined && billingData?.netCost !== null ? 
                `${billingData?.netCost.toFixed(2)} €` : 
                'Non disponibile'}
            </Typography>
          </Box>
        </Grid>
        
        {/* Grafico a torta */}
        <Grid item xs={12} md={6}>
          <Typography 
            variant="subtitle1" 
            gutterBottom 
            sx={{ textAlign: 'center' }}
          >
            Suddivisione per Servizio
          </Typography>
          
          {pieData.length > 0 ? (
            <Box sx={{ height: 280, width: 400, position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 30, bottom: 0, left: 30 }}>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = outerRadius * 1.1;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return (
                        <text 
                          x={x} 
                          y={y} 
                          fill={COLORS[pieData.findIndex(item => item.name === name) % COLORS.length]}
                          textAnchor={x > cx ? 'start' : 'end'} 
                          dominantBaseline="central"
                          fontWeight="bold"
                        >
                          {`${percentage}%`}
                        </text>
                      );
                    }}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [`${value.toFixed(4)} €`, name]}
                    labelFormatter={(label) => ""} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: 250,
              bgcolor: 'rgba(0,0,0,0.03)',
              borderRadius: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                Nessun dato di consumo disponibile
              </Typography>
            </Box>
          )}
        </Grid>
        
        {/* Dettaglio Servizi - Sostituiamo con un formato più compatto */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
            Dettaglio Servizi
          </Typography>
          {billingData?.serviceBreakdown && billingData.serviceBreakdown.length > 0 ? (
            <Grid container spacing={2}>
              {billingData.serviceBreakdown.map((service, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(0,0,0,0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          bgcolor: COLORS[index % COLORS.length],
                          borderRadius: '50%',
                          mr: 1.5
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {service.service}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {service.cost.toFixed(4)} €
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.02)',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Typography variant="body2" color="text.secondary">
                Nessun dato di servizio disponibile
              </Typography>
            </Box>
          )}
        </Grid>
        
        {/* Informazioni Progetto */}
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Progetto: {billingData?.projectId || 'Non disponibile'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Account di fatturazione: {billingData?.billingAccountId || 'Non disponibile'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UsageWidget; 