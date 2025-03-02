import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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

export default function StudentList(props) {
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://team-dhanush.onrender.com/view-student-list") // Update with actual backend URL
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`https://team-dhanush.onrender.com/delete-student/${id}`);
        setStudents(students.filter((student) => student._id !== id));
      } catch (error) {
        console.error("Error deleting student:", error);
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Student List
          </Typography>
        </motion.div>

        {/* Student List Section */}
        <Grid container spacing={3} mt={2}>
          {students.map((student, index) => (
            <Grid item xs={12} key={student._id}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.1 }}>
                <Card sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: 3, transition: "0.3s", "&:hover": { boxShadow: 6 } }}>
                  <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
                    <Typography variant="h6">
                      {index + 1}. {student.s_name} ({student.department}, Semester {student.semester})
                    </Typography>
                    <Box>
                      {/* Monitor Button (Redirects to Student Detail Page) */}
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ display: "inline-block", marginRight: 10 }}>
                        <Button 
                          variant="contained" 
                          sx={{ backgroundColor: "#000", color: "#fff", "&:hover": { backgroundColor: "#FF1493" } }}
                          onClick={() => navigate(`/student-information/${student._id}`)}
                        >
                          Monitor
                        </Button>
                      </motion.div>

                      {/* Delete Button (Removes Student from Database) */}
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ display: "inline-block" }}>
                        <Button 
                          variant="contained" 
                          sx={{ backgroundColor: "red", color: "#fff", "&:hover": { backgroundColor: "darkred" } }}
                          onClick={() => handleDelete(student._id)}
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
