const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Public routes - ĐẢM BẢO CÓ validateRegister
router.post('/register', validateRegister, register);
router.post('/login', login);

// Protected routes
router.get('/me', auth, getMe);

module.exports = router;