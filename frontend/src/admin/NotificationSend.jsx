import * as React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Checkbox, FormControlLabel, Typography, Stack, Paper, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import AppTheme from '../shared-theme/AppTheme';
import Footer from "../dashboardMain/components/Footer";
import AppAppBarAdmin from '../dashboardMain/components/AppAppBarAdmin';

const NotificationContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const NotificationCard = styled(motion(Paper))(({ theme }) => ({
  width: '100%',
  maxWidth: 500,
  padding: theme.spacing(4),
  boxShadow: 'hsla(220, 30%, 5%, 0.1) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.1) 0px 15px 35px -5px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  textAlign: 'center',
}));

const StyledTextarea = styled('textarea')(({ theme }) => ({
  width: '100%',
  minHeight: '100px',
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  border: `1px solid ${theme.palette.grey[400]}`,
  fontSize: '16px',
  fontFamily: 'Arial, sans-serif',
  resize: 'vertical',
  outline: 'none',
  '&:focus': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 5px ${theme.palette.primary.light}`,
  },
}));

export default function NotificationSend() {
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [sendToStudents, setSendToStudents] = useState(true);
  const [sendToTeachers, setSendToTeachers] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState('success');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://team-dhanush.onrender.com/sendmail', {
        subject,
        message,
        sendToStudents,
        sendToTeachers,
      });

      setAlertMessage('Notification sent successfully!');
      setAlertType('success');
      setMessage('');
      setSubject('');

      // Redirect to /dashboard-admin after 2 seconds
      setTimeout(() => {
        navigate('/dashboard-admin');
      }, 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'An error occurred. Please try again.');
      setAlertType('error');
    }
  };

  return (
    <AppTheme>
      <AppAppBarAdmin />
      <NotificationContainer>
        <NotificationCard
          component={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4">Send Notification</Typography>
          <Typography variant="body1">Compose and send messages to students, teachers, or both.</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="subject"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              fullWidth
            />
            <StyledTextarea
              name="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <FormControlLabel
              control={<Checkbox checked={sendToStudents} onChange={(e) => setSendToStudents(e.target.checked)} />}
              label="Students"
            />
            <FormControlLabel
              control={<Checkbox checked={sendToTeachers} onChange={(e) => setSendToTeachers(e.target.checked)} />}
              label="Teachers"
            />
            <Button type="submit" variant="contained" fullWidth>
              Send Notification
            </Button>
          </Box>
        </NotificationCard>
      </NotificationContainer>
      <Footer />
    </AppTheme>
  );
}
