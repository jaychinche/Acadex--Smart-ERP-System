import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom'; // Import useParams
import axios from "axios";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AppTheme from '../shared-theme/AppTheme';
import Footer from "../dashboardMain/components/Footer";
import AppAppBarTeacher from '../dashboardMain/components/AppAppBarTeacher';

const Card = styled(motion(MuiCard))(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const AddResourceContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function AddResource(props) {
  const [resourceTitle, setResourceTitle] = React.useState('');
  const [driveLink, setDriveLink] = React.useState('');
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [alertType, setAlertType] = React.useState("success");
  const navigate = useNavigate();
  const { id } = useParams(); // Fetch course ID from the URL

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!resourceTitle.trim()) {
      setAlertMessage("Resource title cannot be empty.");
      setAlertType("error");
      return;
    }
    if (!driveLink.trim().startsWith("https://drive.google.com")) {
      setAlertMessage("Please enter a valid Google Drive link.");
      setAlertType("error");
      return;
    }

    try {
      await axios.post(`https://team-dhanush.onrender.com/${id}/resource`, {
        res_title: resourceTitle,
        drive_link: driveLink,
      });

      setAlertMessage("Resource added successfully!");
      setAlertType("success");
      setTimeout(() => navigate(`/course-details/${id}`), 2000); // Redirect to course details page
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBarTeacher />

      <AddResourceContainer direction="column" justifyContent="center">
        {alertMessage && (
          <Box sx={{ width: "50%", maxWidth: 600, mx: "auto", mb: 2 }}>
            <Alert
              variant="filled"
              severity={alertType}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setAlertMessage(null)}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {alertMessage}
            </Alert>
          </Box>
        )}
        <Card
          variant="outlined"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography component="h1" variant="h4">Add Resource</Typography>
          <Typography variant="body2" color="text.secondary">
            Upload study materials for your students
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <FormControl>
              <FormLabel>Resource Title</FormLabel>
              <TextField
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                placeholder="Enter the title of the resource"
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel>Drive Link</FormLabel>
              <TextField
                value={driveLink}
                onChange={(e) => setDriveLink(e.target.value)}
                placeholder="Paste the Google Drive link here"
                required
                fullWidth
              />
            </FormControl>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "#000",
                    color: "#fff",
                    "&:hover": { backgroundColor: "#FF1493" }
                  }}
                >
                  Add Resource
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Card>
      </AddResourceContainer>
      <Footer />
    </AppTheme>
  );
}
