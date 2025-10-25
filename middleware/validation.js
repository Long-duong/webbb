const { body, validationResult } = require('express-validator');

exports.validateRegister = [
  body('userName')
    .isLength({ min: 8, max: 30 })
    .withMessage('User Name phải có ít nhất 8 ký tự và tối đa 30 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('User Name chỉ chứa chữ cái, số và gạch dưới'),

  body('firstName')
    .isLength({ min: 8, max: 50 })
    .withMessage('First Name phải có ít nhất 8 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage('First Name chỉ được chứa chữ cái và khoảng trắng')
    .trim(),

  body('lastName')
    .isLength({ min: 8, max: 50 })
    .withMessage('Last Name phải có ít nhất 8 ký tự')
    .matches(/^[a-zA-ZÀ-ỹ\s]+$/)
    .withMessage('Last Name chỉ được chứa chữ cái và khoảng trắng')
    .trim(),

  body('email')
    .isEmail()
    .withMessage('Email không hợp lệ')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password phải có ít nhất 6 ký tự')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)'),

  body('birthday')
    .isISO8601()
    .withMessage('Birthday không hợp lệ')
    .custom((value) => {
      const birthDate = new Date(value);
      return birthDate < new Date();
    })
    .withMessage('Birthday phải là ngày trong quá khứ'),

  body('gender')
    .isIn(['Male', 'Female'])
    .withMessage('Gender phải là Male hoặc Female'),

  // Middleware để xử lý validation results
  (req, res, next) => {
    console.log('Validation running for:', req.body); // DEBUG
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors found:', errors.array()); // DEBUG
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('Validation passed'); // DEBUG
    next();
  }
];