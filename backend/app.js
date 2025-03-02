const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer')


const Teacher = require("./models/Teacher");
const Student = require("./models/Student");
const Admin = require('./models/Admin');
const Course = require('./models/Course');
const Test = require('./models/Test');

const Resource= require('./models/Resource');
const Notification = require("./models/Notification");



const cors = require("cors");
const bcrypt = require('bcryptjs');

dotenv.config();
const app = express();  

const JWT_SECRET=process.env.JWT_SECRET;
app.use(
  session({
      secret:JWT_SECRET, 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: true }, 
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
require('dotenv').config();
app.use(express.json());
app.use(cookieParser()); 


const ORIGIN=process.env.ORIGIN;
app.use(cors({
  origin: "https://team-dhanush-frontend-r07yp0nkw-jaychinches-projects.vercel.app",
  credentials: true,  
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization",'x-auth-token']
}));



//MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
async function main() {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err.message);
    }
}
main();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




app.post("/sign-in", async (req, res) => {
  try {
    const { email, password, userType } = req.body;

    // Validate input
    if (!email || !password || !userType) {
      return res.status(400).json({ error: "Email, password, and userType are required" });
    }

    let user;
    let userCollection;

    // Check userType and fetch user from the appropriate collection
    switch (userType) {
      case "admin":
        user = await Admin.findOne({ email });
        userCollection = "Admin";
        break;
      case "student":
        user = await Student.findOne({ email });
        userCollection = "Student";
        break;
      case "teacher":
        user = await Teacher.findOne({ email });
        userCollection = "Teacher";
        break;
      default:
        return res.status(400).json({ error: "Invalid userType" });
    }

    // Check if user exists
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // // Compare passwords
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(401).json({ error: "Invalid credentials" });
    // }


      if(user.password!==password){
        return res.status(401).json({ error: "Invalid credentials" });
      }

      
    // Generate JWT Token
    const token = jwt.sign(
      { userid: user._id, userType: userType }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Token expiration
    );

    // Send token in response
    res.status(200).json({
      message: "Login successful",
      token,
      userType: userType,
      userCollection: userCollection, // Optional: For debugging
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});













//sample testing
app.post("/",(req,res)=>{

  
})


// for admin

// POST route to create a new admin
app.post("/admin", async (req, res) => {
  try {
    // Extract email and password from the request body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Create a new admin document
    const newAdmin = new Admin({
      email: email,
      password: password // In a real application, hash the password before saving
    });

    // Save the admin to the database
    await newAdmin.save();

    // Respond with success message
    res.status(201).json({ message: "Admin created successfully", admin: newAdmin });
  } catch (error) {
    // Handle errors (e.g., duplicate email, validation errors)
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// app.post("/teachers", async (req, res) => {
//   try {
//     // Extract data from the request body
//     const { name, department, email, password } = req.body;

//     // Check if all required fields are provided
//     if (!name || !department || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Create a new teacher document
//     const newTeacher = new Teacher({
//       name,
//       department,
//       email,
//       password, // In a real application, hash the password before saving
//     });

//     // Save the teacher to the database
//     await newTeacher.save();

//     // Respond with success message
//     res.status(201).json({ message: "Teacher saved successfully", teacher: newTeacher });
//   } catch (error) {
//     // Handle errors (e.g., duplicate email, validation errors)
//     if (error.code === 11000) {
//       return res.status(400).json({ message: "Email already exists" });
//     }
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });


app.post("/add-students", async (req, res) => {
  try {
    const t_id = "67c3635cc1e8c83fe89c9c05"; // Example teacher ID
    const { s_name, email, password, department, semester, fees_paid } = req.body;

    // Check if all required fields are provided
    if (!s_name || !email || !password || !department || !semester || !t_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new student document
    const newStudent = new Student({
      s_name,
      email,
      password, // In real apps, hash the password before saving
      department,
      semester,
      t_id,
      fees_paid: fees_paid || false, // Default to false if not provided
    });

    // Save the student to the database
    await newStudent.save();

    // Respond with success message
    res.status(201).json({ message: "Student saved successfully", student: newStudent });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



app.post("/teachers/add", async (req, res) => {
  try {
    const { name, email, password, department, assignedCourses } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new teacher document
    const newTeacher = new Teacher({
      name,
      email,
      password, // In a real application, hash the password before saving
      department,
      assignedCourses: assignedCourses || [], // Default to an empty array if not provided
    });

    // Save the teacher to the database
    await newTeacher.save();

    // Respond with success message
    res.status(201).json({ message: "Teacher saved successfully", teacher: newTeacher });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});



app.post("/jay", async (req, res) => {
  try {
    const { c_name, semester, t_id } = req.body;

    // Check if all required fields are provided
    if (!c_name || !semester || !t_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new course document
    const newCourse = new Course({
      c_name,
      semester,
      t_id,
    });

    // Save the course to the database
    await newCourse.save();

    // Respond with success message
    res.status(201).json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    // Handle errors (e.g., validation errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/tests", async (req, res) => {
  try {
    const { s_id, t_id, c_id, score } = req.body;

    // Check if all required fields are provided
    if (!s_id || !t_id || !c_id || !score) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Ensure s_id and score arrays have the same length
    if (s_id.length !== score.length) {
      return res.status(400).json({ error: "s_id and score arrays must have the same length" });
    }

    // Create a new test document
    const newTest = new Test({
      s_id,
      t_id,
      c_id,
      score,
    });

    // Save the test to the database
    await newTest.save();

    // Respond with success message
    res.status(201).json({ message: "Test created successfully", test: newTest });
  } catch (error) {
    // Handle errors (e.g., validation errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/resources", async (req, res) => {
  try {
    const { res_title, drive_link, c_id } = req.body;

    // Check if all required fields are provided
    if (!res_title || !drive_link || !c_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new resource document
    const newResource = new Resource({
      res_title,
      drive_link,
      c_id,
    });

    // Save the resource to the database
    await newResource.save();

    // Respond with success message
    res.status(201).json({ message: "Resource created successfully", resource: newResource });
  } catch (error) {
    // Handle errors (e.g., validation errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
});



app.post("/quizzes", async (req, res) => {
  try {
    const { topic, questions } = req.body;

    // Check if all required fields are provided
    if (!topic || !questions) {
      return res.status(400).json({ error: "Topic and questions are required" });
    }

    // Create a new quiz document
    const newQuiz = new Quiz({
      topic,
      questions,
    });

    // Save the quiz to the database
    await newQuiz.save();

    // Respond with success message
    res.status(201).json({ message: "Quiz created successfully", quiz: newQuiz });
  } catch (error) {
    // Handle errors (e.g., validation errors)
    res.status(500).json({ error: "Internal Server Error" });
  }
});















// for admin all route 


app.get("/view-student-list", async (req, res) => {
  try {
    const students = await Student.find({}, "s_name email department semester fees_paid");
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch student list" });
  }
});
app.get("/view-teacher-list", async (req, res) => {
  try {
    // Fetch all teachers from the database
    const teachers = await Teacher.find({}, { password: 0 }); // Exclude password field
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.delete("/delete-teacher/:id", async (req, res) => {
  console.log("delete student")
  try {
    const { id } = req.params;
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher ) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.status(200).json({ message: "Teacher deleted successfully" });
  } catch (error) {
    console.error("Error deleting teacher :", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.delete("/delete-student/:id", async (req, res) => {
  console.log("delete student")
  try {
    const { id } = req.params;
    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



app.get("/view-student-list/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findById(studentId).populate("t_id");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const courses = await Course.find({ semester: student.semester });
    const testResults = await Test.find({ s_id: studentId }).populate("c_id");

    const response = {
      fullName: student.s_name,
      studentID: student._id,
      email: student.email,
      department: student.department,
      semester: student.semester,
      advisor: student.t_id ? student.t_id.name : "N/A",
      paymentStatus: student.fees_paid ? "Paid" : "Unpaid",
      courses: courses.map((course) => {
        const test = testResults.find((t) => t.c_id._id.equals(course._id));
        return {
          courseName: course.c_name,
          instructor: course.t_id ? course.t_id.name : "Unknown",
          marks: test ? test.score[0] : 0,
          grade: test ? getGrade(test.score[0]) : "N/A",
        };
      }),
    };

    res.json(response);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.toString() });
  }
});



// Helper function to calculate grades
const getGrade = (marks) => {
  if (marks >= 90) return "A+";
  if (marks >= 80) return "A";
  if (marks >= 70) return "B+";
  if (marks >= 60) return "B";
  return "C";
};







app.post("/students/add", async (req, res) => {
  try {

    console.log("ram ram");

    
    const { fullName, email, password, department, semester, feesPaid } = req.body;

    console.log(fullName, email, password, department, semester, feesPaid);
    const t_id="67c3635cc1e8c83fe89c9c05";

    if (!fullName || !email || !password || !department || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ fullName, email, t_id,password, department, semester, feesPaid });

    await newStudent.save();
    console.log("ram ram jay hanuman");
    res.status(201).json({ message: "Student added successfully", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});





app.post('/sendmail', async (req, res) => {
  try {
    const { subject, message, sendToStudents, sendToTeachers } = req.body;
    console.log(subject, message, sendToStudents, sendToTeachers);

    // Validate input
    if (!subject || !message || (!sendToStudents && !sendToTeachers)) {
      return res.status(400).json({ message: 'Subject, message, and at least one recipient type are required.' });
    }

    // Fetch emails based on selection
    let emailList = [];
    if (sendToStudents) {
      const students = await Student.find({}, 'email');
      emailList.push(...students.map((student) => student.email));
    }
    if (sendToTeachers) {
      const teachers = await Teacher.find({}, 'email');
      emailList.push(...teachers.map((teacher) => teacher.email));
    }

    if (emailList.length === 0) {
      return res.status(200).json({ message: 'No recipients found for email notifications.' });
    }

    // Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: 'chinchejay@gmail.com', // Replace with your email
        pass: 'xtqf ftin fnvq rgqp', // Replace with your app password
      },
    });

    // Email details
    const mailOptions = {
      from: 'chinchejay@gmail.com', // Replace with your email
      to: emailList,
      subject: subject,
      text: `Dear Recipients,\n\n${message}\n\nBest regards,\nAdmin Team`,
    };

    // Send emails
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email', error });
      }

      // Save notification details to the database
      const newNotification = new Notification({
        subject,
        message,
     
      });
      await newNotification.save();

      console.log('Emails sent successfully:', info.response);
      res.status(200).json({ message: 'Emails sent successfully.', info });
    });
  } catch (error) {
    console.error('Error in sendmail route:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});





// for teacher

app.get('/course-list', async (req, res) => {
  try {
    const { t_id } = req.query; // Get teacher ID from query parameters

    if (!t_id) {
      return res.status(400).json({ message: 'Teacher ID is required.' });
    }

    // Fetch courses associated with the teacher ID
    const courses = await Course.find({ t_id });

    if (courses.length === 0) {
      return res.status(404).json({ message: 'No courses found for this teacher.' });
    }

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


app.post('/course/:id/resource', async (req, res) => {
  try {
    const { id } = req.params; // Fetch course ID from the URL
    const { res_title, drive_link } = req.body; // Fetch resource data from the request body

    // Validate input
    if (!res_title || !drive_link) {
      return res.status(400).json({ message: 'Resource title and drive link are required.' });
    }

    // Create a new resource document
    const newResource = new Resource({
      res_title,
      drive_link,
      c_id: id, // Associate the resource with the course ID
    });

    // Save the resource to the database
    await newResource.save();

    // Respond with success message
    res.status(201).json({ message: 'Resource added successfully!', resource: newResource });
  } catch (error) {
    console.error('Error adding resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



app.get('/notifications', async (req, res) => {
  try {
    // Fetch all notifications from the database
    const notifications = await Notification.find({});

    if (notifications.length === 0) {
      return res.status(200).json({ message: 'No notifications found.' });
    }

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});






// app.get('/course-list-student', async (req, res) => {
//   try {
//     const { s_id } = req.query; // Get teacher ID from query parameters

//     if (!s_id) {
//       return res.status(400).json({ message: 'Teacher ID is required.' });
//     }

//     // Fetch courses associated with the teacher ID
//     const courses = await Course.find({ s_id });

//     if (courses.length === 0) {
//       return res.status(404).json({ message: 'No courses found for this teacher.' });
//     }

//     res.status(200).json(courses);
//   } catch (error) {
//     console.error('Error fetching courses:', error);
//     res.status(500).json({ message: 'Internal server error.' });
//   }
// });


