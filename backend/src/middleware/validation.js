const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules for subscriber
const validateSubscriber = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be between 2 and 255 characters'),

  body('first_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }).withMessage('First name too long'),
  body('last_name').optional({ checkFalsy: true }).trim().isLength({ max: 100 }).withMessage('Last name too long'),
  body('birth_date').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid birth date'),
  body('city').optional({ checkFalsy: true }).trim().isLength({ max: 100 }).withMessage('City too long'),
  body('province').optional({ checkFalsy: true }).trim().isLength({ max: 4 }).withMessage('Invalid province'),
  body('postal_code').optional({ checkFalsy: true }).trim().isLength({ max: 10 }).withMessage('Invalid postal code'),

  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 }).withMessage('Phone number too long'),

  body('address')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 }).withMessage('Address too long'),

  body('subscription_year')
    .notEmpty().withMessage('Subscription year is required')
    .isInt({ min: 2020, max: 2100 }).withMessage('Invalid subscription year'),

  body('notes')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Notes too long'),

  handleValidationErrors
];

// Validation rules for login
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  handleValidationErrors
];

// Validation rules for UUID parameters
const validateUUID = [
  param('id')
    .notEmpty().withMessage('ID is required')
    .isUUID().withMessage('Invalid ID format'),

  handleValidationErrors
];

// Validation rules for query parameters
const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),

  query('status')
    .optional()
    .isIn(['active', 'deleted', 'pending', 'all']).withMessage('Invalid status'),

  query('subscription_year')
    .optional()
    .isInt({ min: 2020, max: 2100 }).withMessage('Invalid subscription year'),

  handleValidationErrors
];

module.exports = {
  validateSubscriber,
  validateLogin,
  validateUUID,
  validateQueryParams,
  handleValidationErrors
};
