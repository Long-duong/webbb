require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./config/database');

const app = express();

// Khởi tạo database
initDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));  // ← QUAN TRỌNG: serve static files từ public

// Routes
app.use('/api/auth', require('./routes/auth'));  // ← DÒNG GÂY LỖI

// Serve signup page
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');  // ← ĐƯỜNG DẪN ĐÚNG
});

// Home page
app.get('/', (req, res) => {
  res.json({ message: 'Server đang chạy với MySQL!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using MySQL database: ${process.env.DB_NAME}`);
});