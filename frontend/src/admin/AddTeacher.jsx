import * as React from "react";
import { motion } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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
  boxShadow: "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const AddTeacherContainer = styled(Stack)(({ theme }) => ({
  height: "100vh",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
}));

export default function AddTeacher(props) {
  const [alertMessage, setAlertMessage] = React.useState(null);
  const [alertType, setAlertType] = React.useState("success");
  const [assignedCourses, setAssignedCourses] = React.useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setAssignedCourses((prev) =>
      checked ? [...prev, value] : prev.filter((course) => course !== value)
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const teacherData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      department: formData.get("department"),
      assignedCourses,
    };

    try {
      await axios.post("https://team-dhanush.onrender.com/teachers/add", teacherData);
      setAlertMessage("Teacher added successfully!");
      setAlertType("success");
      setTimeout(() => navigate("/teacher-list"), 2000);
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "An error occurred. Please try again.");
      setAlertType("error");
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBarAdmin />
      <br></br>
      <AddTeacherContainer direction="column" justifyContent="center">
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
          <Typography component="h1" variant="h4">Add New Teacher</Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <TextField name="name" required fullWidth />
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
              <FormLabel>Assign Courses</FormLabel>
              <Grid container spacing={1}>
                {['Web Development', 'Data Structures', 'Database Systems', 'Machine Learning', 'Software Engineering', 'Computer Networks'].map((course, index) => (
                  <Grid item xs={6} key={index}>
                    <FormControlLabel
                      control={<Checkbox value={course} onChange={handleCheckboxChange} />}
                      label={course}
                    />
                  </Grid>
                ))}
              </Grid>
            </FormControl>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button type="submit" fullWidth variant="contained" sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#FF1493" } }}>
                Add Teacher
              </Button>
            </motion.div>
          </Box>
        </Card>
      </AddTeacherContainer>
      <Footer />
    </AppTheme>
  );
}
