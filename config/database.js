const mysql = require('mysql2/promise');

const createConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT
    });
    
    console.log('MySQL connected successfully');
    return connection;
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

// Tạo bảng users nếu chưa tồn tại
const initDatabase = async () => {
  try {
    const connection = await createConnection();
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userName VARCHAR(50) UNIQUE NOT NULL,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        birthday DATE NOT NULL,
        gender ENUM('Male', 'Female') NOT NULL,
        isActive BOOLEAN DEFAULT TRUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.execute(createTableQuery);
    console.log('Users table created/verified');
    await connection.end();
    
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { createConnection, initDatabase };