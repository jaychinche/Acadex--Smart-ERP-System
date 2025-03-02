import React, { useEffect, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import AppTheme from "../shared-theme/AppTheme";
import AppAppBarTeacher from "../dashboardMain/components/AppAppBarTeacher";
import Footer from "../dashboardMain/components/Footer";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function CoursesListTeacher(props) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch courses based on teacher ID
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const t_id = "67c3635cc1e8c83fe89c9c05"; // Replace with the actual teacher ID (e.g., from props or context)
        const response = await axios.get(
          `https://team-dhanush.onrender.com/course-list?t_id=${t_id}`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "An error occurred while fetching courses."
        );
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBarTeacher />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <Container maxWidth="md">
        {/* Heading with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold" }}
          >
            Course List
          </Typography>
        </motion.div>

        {/* Card Section */}
        <Grid container spacing={3} mt={2}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} key={course._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    transition: "0.3s",
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardContent sx={{ textAlign: "center", p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                      {course.c_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Semester: {course.semester}
                    </Typography>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      
                      <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#000",
                        color: "#fff",
                        "&:hover": { backgroundColor: "#FF1493" },
                        mt: 2,
                      }}
                       component={Link} to={`/course-details/${course._id}`}   color="info" size="small">
                      Explore
              </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      <br />
      <br />
      <br />
      <br />
      <Footer />
    </AppTheme>
  );
}
