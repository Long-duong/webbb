const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

// Đăng ký user
exports.register = async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userName, firstName, lastName, email, password, address, birthday, gender } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { userName }] 
    });
    
    if (existingUser) {
      return res.status(400).json({
        error: 'USER_EXISTS',
        message: 'Email hoặc username đã tồn tại'
      });
    }

    // Create user
    const user = await User.create({
      userName,
      firstName,
      lastName,
      email,
      password,
      address,
      birthday,
      gender
    });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công!',
      token,
      user: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Lỗi server, vui lòng thử lại'
    });
  }
};

// Đăng nhập
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: 'INVALID_CREDENTIALS',
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Check password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: 'INVALID_CREDENTIALS', 
        message: 'Email hoặc mật khẩu không đúng'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    res.json({
      success: true,
      message: 'Đăng nhập thành công!',
      token,
      user: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Lỗi server, vui lòng thử lại'
    });
  }
};

// Lấy thông tin user hiện tại
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'USER_NOT_FOUND',
        message: 'User không tồn tại'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      error: 'SERVER_ERROR',
      message: 'Lỗi server, vui lòng thử lại'
    });
  }
};