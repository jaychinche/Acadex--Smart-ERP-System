import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { motion } from "framer-motion";
import AppTheme from "../shared-theme/AppTheme";
import AppAppBarAdmin from "../dashboardMain/components/AppAppBarAdmin";
import Footer from "../dashboardMain/components/Footer";
import axios from "axios";

export default function TeacherList(props) {
  const [teachers, setTeachers] = useState([]);

  // Fetch teacher data from the backend
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get("https://team-dhanush.onrender.com/view-teacher-list");
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this teacher?")) {
      try {
        await axios.delete(`http://localhost:4000/delete-teacher/${id}`);
        setTeachers(teachers.filter((teacher) => teacher._id !== id));
      } catch (error) {
        console.error("Error deleting teacher:", error);
      }
    }
  };

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBarAdmin />
      <br /><br /><br /><br />
      <br /><br /><br /><br />

      <Container maxWidth="md">
        {/* Heading with animation */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Teacher List
          </Typography>
        </motion.div>

        {/* Teacher List Section */}
        <Grid container spacing={3} mt={2}>
          {teachers.map((teacher, index) => (
            <Grid item xs={12} key={teacher._id}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                <Card sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                    <Box>
                      <Typography variant="h6">
                        {index + 1}. {teacher.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Department: {teacher.department}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Email: {teacher.email}
                      </Typography>
                    </Box>
                    <Box>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ display: "inline-block", marginRight: 10 }}>
                        <Button variant="contained" sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#FF1493" } }}>
                          Monitor
                        </Button>
                      </motion.div>
                       {/* Delete Button (Removes Student from Database) */}
                       <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ display: "inline-block" }}>
                        <Button 
                          variant="contained" 
                          sx={{ backgroundColor: "red", color: "#fff", "&:hover": { backgroundColor: "darkred" } }}
                          onClick={() => handleDelete(teacher._id)}
                        >
                          Delete
                        </Button>
                      </motion.div>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
      <br /><br /><br /><br />
      <Footer />
    </AppTheme>
  );
}
