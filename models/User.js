const { createConnection } = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Tìm user bằng email hoặc username
  static async findOne(conditions) {
    const connection = await createConnection();
    try {
      let query = 'SELECT * FROM users WHERE ';
      const params = [];
      
      if (conditions.email) {
        query += 'email = ?';
        params.push(conditions.email);
      } else if (conditions.userName) {
        query += 'userName = ?';
        params.push(conditions.userName);
      } else if (conditions.$or) {
        query += '(email = ? OR userName = ?)';
        params.push(conditions.$or[0].email, conditions.$or[1].userName);
      }
      
      const [rows] = await connection.execute(query, params);
      return rows[0] || null;
      
    } finally {
      await connection.end();
    }
  }

  // Tìm user bằng ID
  static async findById(id) {
    const connection = await createConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, userName, firstName, lastName, email, address, birthday, gender, createdAt FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } finally {
      await connection.end();
    }
  }

  // Tạo user mới
  static async create(userData) {
    const connection = await createConnection();
    try {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      const query = `
        INSERT INTO users (userName, firstName, lastName, email, password, address, birthday, gender) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const [result] = await connection.execute(query, [
        userData.userName,
        userData.firstName,
        userData.lastName,
        userData.email,
        hashedPassword,
        userData.address || null,
        new Date(userData.birthday),
        userData.gender
      ]);
      
      return { id: result.insertId, ...userData };
      
    } finally {
      await connection.end();
    }
  }

  // So sánh password
  static async comparePassword(candidatePassword, hashedPassword) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }
}

module.exports = User;