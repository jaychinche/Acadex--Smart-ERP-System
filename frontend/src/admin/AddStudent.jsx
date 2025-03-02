import * as React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControlLabel,
  FormLabel,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
  Alert,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/material/styles";
import axios from "axios";

import AppTheme from "../shared-theme/AppTheme";
import Footer from "../dashboardMain/components/Footer";
import AppAppBarAdmin from "../dashboardMain/components/AppAppBarAdmin";

const Card = styled(motion(MuiCard))(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const AddStudentContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function AddStudent(props) {
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [alertType, setAlertType] = React.useState("success");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentData = {
      s_name: formData.get("s_name"),
      email: formData.get("email"),
      password: formData.get("password"),
      department: formData.get("department"),
      semester: parseInt(formData.get("semester"), 10),
      fees_paid: formData.get("fees_paid") === "on",
    };

    try {
      await axios.post("https://team-dhanush.onrender.com/add-students", studentData);
      setAlertMessage("Student added successfully!");
      setAlertType("success");
      setTimeout(() => navigate("/dashboard-admin"), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBarAdmin />
      <AddStudentContainer direction="column" justifyContent="center">
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
          <Typography component="h1" variant="h4">
            Add New Student
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}
          >
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <TextField name="s_name" required fullWidth />
            </FormControl>
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <TextField name="email" type="email" required fullWidth />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <TextField name="password" type="password" required fullWidth />
            </FormControl>
            <FormControl>
              <FormLabel>Department</FormLabel>
              <Select name="department" required fullWidth>
                <MenuItem value="Computer Science">Computer Science</MenuItem>
                <MenuItem value="Mechanical">Mechanical</MenuItem>
                <MenuItem value="Electrical">Electrical</MenuItem>
                <MenuItem value="Civil">Civil</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Semester</FormLabel>
              <TextField name="semester" type="number" required fullWidth />
            </FormControl>
            <FormControlLabel control={<Checkbox name="fees_paid" color="primary" />} label="Fees Paid" />
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#FF1493" },
                }}
              >
                Add Student
              </Button>
            </motion.div>
          </Box>
        </Card>
      </AddStudentContainer>
      <Footer />
    </AppTheme>
  );
}
