import React, { useState, useEffect, useRef } from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
import FactCheckIcon from '@mui/icons-material/FactCheck';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';

function AnimatedCounter({ value, duration = 1500, suffix = "" }) {
  const parsed = parseFloat(value);
  const [count, setCount] = useState(isNaN(parsed) ? 0 : parsed);
  const prevValueRef = useRef(isNaN(parsed) ? 0 : parsed);

  useEffect(() => {
    const end = parseFloat(value);
    if (isNaN(end)) {
      setCount(value);
      return;
    }

    const start = prevValueRef.current;
    if (start === end) return;

    let startTime = null;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const rate = Math.min(progress / duration, 1);
      
      const easeRate = rate === 1 ? 1 : 1 - Math.pow(2, -10 * rate);
      const currentVal = start + (end - start) * easeRate;
      
      setCount(Number.isInteger(end) ? Math.floor(currentVal) : Number(currentVal.toFixed(1)));

      if (rate < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
        prevValueRef.current = end;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{count}{suffix}</span>;
}

export default function KPICards({ summary = {} }) {
  const totalTests = summary.passed !== undefined && summary.failed !== undefined 
    ? summary.passed + summary.failed 
    : 2847;
  
  const passRate = totalTests > 0 && summary.passed !== undefined 
    ? Math.round((summary.passed / totalTests) * 100 * 10) / 10
    : 94.7;
    
  const openBugs = summary.openBugs !== undefined ? summary.openBugs : 23;
  const coverage = summary.coverage !== undefined ? summary.coverage : 78;

  const cards = [
    {
      title: "Total Tests",
      value: totalTests,
      trend: "↑12.5%",
      trendColor: "#4caf50",
      icon: <FactCheckIcon sx={{ fontSize: 28, color: 'white' }} />,
      gradient: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
    },
    {
      title: "Pass Rate",
      value: passRate,
      suffix: "%",
      trend: "↑2.3%",
      trendColor: "#4caf50",
      icon: <CheckCircleOutlineIcon sx={{ fontSize: 28, color: 'white' }} />,
      gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    },
    {
      title: "Open Bugs",
      value: openBugs,
      trend: "↓4",
      trendColor: "#4caf50",
      icon: <BugReportOutlinedIcon sx={{ fontSize: 28, color: 'white' }} />,
      gradient: "linear-gradient(135deg, #f12711 0%, #f5af19 100%)",
    },
    {
      title: "Automation",
      value: coverage,
      suffix: "%",
      trend: "↑5%",
      trendColor: "#4caf50",
      icon: <ShutterSpeedIcon sx={{ fontSize: 28, color: 'white' }} />,
      gradient: "linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {cards.map((card) => (
        <Grid size={{xs: 12, sm: 6, md: 3}} key={card.title}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 3,
                    background: card.gradient,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
                  }}
                >
                  {card.icon}
                </Box>
                {card.trend && (
                  <Box sx={{ display: 'flex', alignItems: 'center', color: card.trendColor }}>
                    <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.85rem' }}>
                      {card.trend}
                    </Typography>
                  </Box>
                )}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                {card.title}
              </Typography>

              <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
                <AnimatedCounter value={card.value} suffix={card.suffix || ""} />
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
