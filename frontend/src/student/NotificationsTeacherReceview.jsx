import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AppTheme from '../shared-theme/AppTheme';
import Footer from '../dashboardMain/components/Footer';
import AppAppBarStudent from '../dashboardMain/components/AppAppBarStudent';

const Card = styled(motion(MuiCard))(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '800px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const NotificationsContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function NotificationsTeacherReceview(props) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications from the backend
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://team-dhanush.onrender.com/notifications');
        setNotifications(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred while fetching notifications.');
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <AppTheme {...props}>
    
      <AppAppBarStudent />
      <br /><br /><br /><br />
      <br /><br /><br /><br />

      <NotificationsContainer direction="column" justifyContent="center">
        {/* Heading with animation */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
            Notifications
          </Typography>
        </motion.div>

        {/* Notification List */}
        <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification._id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {notification.subject}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </NotificationsContainer>

      <br /><br /><br /><br />
      <Footer />
    </AppTheme>
  );
}
