import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Alert,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import AppTheme from "./shared-theme/AppTheme";
import AppAppBar from "./dashboardMain/components/AppAppBar"
import Footer from "./dashboardMain/components/Footer";
import ColorModeSelect from "./shared-theme/ColorModeSelect";
import CloseIcon from "@mui/icons-material/Close";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "450px",
  },
}));

export default function AddEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState("success");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlertMessage(null); 
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post("https://team-dhanush.onrender.com/addemp", formData, {
        withCredentials: true,
        headers: {
          'x-auth-token': token, 
      },
      });

      setAlertMessage("Employee added successfully! 🎉");
      setAlertType("success");

      setTimeout(() => {
        navigate("/dashboard"); 
      }, 2000);
    } catch (err) {
      setAlertMessage(
        err.response?.data?.message || "Failed to add employee. Try again."
      );
      setAlertType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />

      <motion.div
        layout
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          textAlign: "center",
          height: "100vh",
        }}
      >
        <Stack direction="column" justifyContent="center" alignItems="center" sx={{ height: "100vh" }}>
          {alertMessage && (
            
            <Box sx={{ width: "90%", maxWidth: 600, mx: "auto", mb: 2 }}>
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
          <Card variant="outlined">
            <Typography
              variant="h4"
              component={motion.h4}
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              sx={{ fontWeight: "bold", textAlign: "left" }}
            >
              Add Employee
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <FormControl>
                <FormLabel htmlFor="username" sx={{ textAlign: "left" }}>Full Name</FormLabel>
                <TextField required fullWidth id="username" name="username" value={formData.username} onChange={handleChange} />
              </FormControl>
              <FormControl>
                <FormLabel sx={{  textAlign: "left" }}htmlFor="email">Email</FormLabel>
                <TextField required fullWidth id="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" />
              </FormControl>
              <FormControl>
                <FormLabel sx={{  textAlign: "left" }} htmlFor="password">Password</FormLabel>
                <TextField required fullWidth id="password" name="password" value={formData.password} onChange={handleChange} type="password" autoComplete="new-password" />
              </FormControl>
              <FormControlLabel control={<Checkbox value="allowExtraEmails" color="primary" />} label="Send welcome email to employee." />
              <Button type="submit" fullWidth variant="contained" disabled={loading}>
                {loading ? "Adding..." : "Add Employee"}
              </Button>
            </Box>
          </Card>
        </Stack>
      </motion.div>
      <Footer />
    </AppTheme>
  );
}
