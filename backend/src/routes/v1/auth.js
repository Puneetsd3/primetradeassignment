const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
};

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Puneet
 *               email:
 *                 type: string
 *                 example: puneet@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       '201':
 *         description: Created — returns token and user (without password)
 *       '400':
 *         description: Validation error
 *       '409':
 *         description: Email already in use
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: puneet@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       '200':
 *         description: Success — returns token and user
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Invalid credentials
 */


router.post('/register',
  body('name').isLength({ min: 2 }).withMessage('Name too short'),
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { name, email, password } = req.body;
      const existing = await User.findOne({ where: { email }});
      if (existing) return res.status(409).json({ message: 'Email already in use' });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, passwordHash });
      const token = generateToken(user);
      return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
    } catch (err) { next(err); }
  });

router.post('/login',
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password required'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email }});
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      const match = await bcrypt.compare(password, user.passwordHash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const token = generateToken(user);
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role }});
    } catch (err) { next(err); }
  });

module.exports = router;
