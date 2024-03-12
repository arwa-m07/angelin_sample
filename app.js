const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const { error } = require('console');
// const { randomUUID } = require('crypto');

// Create an Express application
const app = express();

// MySQL connection settings
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'shiny',
    database: 'shiny'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});
// Serve static files from 'project' directory
app.use(express.static(__dirname));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Serve HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/register-faculty.html');
});
// Define storage for multer
const storage = multer.memoryStorage();

// Define file filter to only accept jpg, jpeg, and png files
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only JPG, JPEG, and PNG file formats are allowed!'), false);
  }
};

// Set up multer with specified storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 }, // Limit to 1 MB
  fileFilter: fileFilter
});
// Handle form submission
app.post('/register-form', upload.single('profilePhoto'), (req, res) => {
  const {
    FacultyFirstName,
    FacultyLastName,
    dob,
    CollegeEmailId,
    CollegePassword,
    Department,
    Designation,
    Qualification,
    YearsOfExperience,
    SubjectsExpertise
  } = req.body;

  // Convert the file buffer to base64 for storage
  const profilePhoto = req.file.buffer.toString('base64');

  // Insert data into the database
  const sql = `
    INSERT INTO facultyinformation (
      FacultyFirstName, 
      FacultyLastName, 
      dob, 
      CollegeEmailId, 
      CollegePassword, 
      Department, 
      Designation, 
      Qualification, 
      YearsOfExperience, 
      SubjectsExpertise, 
      Photo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      FacultyFirstName,
      FacultyLastName,
      dob,
      CollegeEmailId,
      CollegePassword,
      Department,
      Designation,
      Qualification,
      YearsOfExperience,
      SubjectsExpertise,
      profilePhoto
    ],
    (err, result) => {
      if (err) {
        console.error('Error inserting data into the database:', err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Data inserted successfully');
        res.send('Registration successful!');
      }
    }
  );
});











// Start server
const PORT = 3307;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})