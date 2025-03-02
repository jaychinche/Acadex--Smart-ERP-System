import * as React from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Alert, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import AppTheme from './shared-theme/AppTheme';

import Footer from "./dashboardMain/components/Footer";
import AppAppBarCommon from './dashboardMain/components/AppAppBarCommon';

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

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: '100vh',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

export default function SignIn(props) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [usertype, setUsertype] = React.useState("user");
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [alertType, setAlertType] = React.useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    const userType = formData.get("userType");

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email.");
      return;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 6 characters.");
      return;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    try {
      const response = await axios.post("https://team-dhanush.onrender.com/sign-in", {
        email,
        password,
        userType,
      });

      localStorage.setItem("token", response.data.token);
      setAlertMessage("Login successful!");
      setAlertType("success");

      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        setTimeout(() => {
          switch (decodedToken.userType) {
            case "admin":
              navigate("/dashboard-admin");
              break;
            case "student":
              navigate("/dashboard-student");
              break;
            case "teacher":
              navigate("/dashboard-teacher");
              break;
            default:
              navigate("/"); // Fallback to home or login page
          }
        }, 2000);
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.error || "An error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBarCommon />
     
      <SignInContainer direction="column" justifyContent="center">
     
        {alertMessage && (
          
          <Box sx={{ width: "50%", maxWidth: 600, mx: "auto", mb: 2 }}>
             <br></br><br></br><br></br>   <br></br><br></br><br></br>
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
          <Typography component="h1" variant="h4">Login</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <TextField error={emailError} helperText={emailErrorMessage} name="email" type="email" required fullWidth />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField error={passwordError} helperText={passwordErrorMessage} name="password" type="password" required fullWidth />
            </FormControl>
            <FormControl>
              <FormLabel>User Type</FormLabel>
              <Select name="userType" value={usertype} onChange={(e) => setUsertype(e.target.value)} fullWidth>
                <MenuItem value="student">Student</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="teacher">Teacher</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
            <Button type="submit" fullWidth variant="contained">Login</Button>
          </Box>
        </Card>
      </SignInContainer>
      <Footer />
    </AppTheme>
  );
}
