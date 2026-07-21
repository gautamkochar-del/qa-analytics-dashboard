import React, { useEffect, useState, useRef } from 'react';
import { 
  Card, CardContent, Typography, Box, List, ListItem, 
  ListItemIcon, ListItemText, Chip, Badge, IconButton, Tooltip, Divider 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import CellTowerIcon from '@mui/icons-material/CellTower';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import BugReportIcon from '@mui/icons-material/BugReport';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import GitHubIcon from '@mui/icons-material/GitHub';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PersonIcon from '@mui/icons-material/Person';
import { useSocket } from "../../../context/SocketContext";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Notifications() {
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const listRef = useRef(null);

  // Auto-scroll when new notifications arrive
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0; // Keeping newest at the top
    }
  }, [notifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification) => {
      // notification payload format: { type, action, project, status, time, text }
      const newNotif = {
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false,
        ...notification
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    };

    socket.on("liveEvent", handleNewNotification);
    
    return () => {
      socket.off("liveEvent", handleNewNotification);
    };
  }, [socket]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type) => {
    switch(type) {
      case 'testrun': return <PlayCircleIcon color="primary" />;
      case 'bug': return <BugReportIcon color="error" />;
      case 'jenkins': return <RocketLaunchIcon color="warning" />;
      case 'github': return <GitHubIcon sx={{ color: '#24292e' }} />;
      case 'report': return <AssessmentIcon color="info" />;
      case 'user': return <PersonIcon color="secondary" />;
      default: return <CheckCircleIcon color="success" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2, pb: "16px !important" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Badge badgeContent={unreadCount} color="error">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Live Feed
              </Typography>
            </Badge>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip 
              icon={<CellTowerIcon fontSize="small" />} 
              label="Connected" 
              size="small" 
              color="success" 
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                  '100%': { opacity: 1 },
                }
              }}
            />
            <Tooltip title="Clear All">
              <IconButton size="small" onClick={clearAll}>
                <ClearAllIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box 
          ref={listRef}
          sx={{ 
            flex: 1, 
            overflowY: 'auto', 
            maxHeight: 300,
            mr: -1, 
            pr: 1,
            '&::-webkit-scrollbar': { width: '4px' },
            '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' }
          }}
        >
          {notifications.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
              <Typography variant="body2">No recent activity</Typography>
            </Box>
          ) : (
            <List disablePadding>
              {notifications.map((notif, index) => (
                <React.Fragment key={notif.id}>
                  <ListItem 
                    disableGutters 
                    sx={{ 
                      py: 1.5, 
                      px: 1, 
                      bgcolor: notif.read ? 'transparent' : 'rgba(37, 99, 235, 0.04)',
                      borderRadius: 1,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.02)' }
                    }}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Badge variant="dot" color="primary" invisible={notif.read}>
                        {getIcon(notif.type)}
                      </Badge>
                    </ListItemIcon>
                    <ListItemText 
                      primary={notif.text || `${notif.project || 'System'} ${notif.action}`} 
                      secondary={dayjs(notif.timestamp).fromNow()}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: notif.read ? 500 : 700 }}
                      secondaryTypographyProps={{ variant: 'caption', fontWeight: 500 }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
