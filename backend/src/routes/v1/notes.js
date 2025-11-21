const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Note } = require('../../models');
const { authenticate } = require('../../middleware/authMiddleware');

// all routes require auth
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   - name: Notes
 *     description: CRUD operations for notes (authenticated)
 */


// Create note
router.post('/',
  body('title').isLength({ min: 1 }).withMessage('Title required'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
      const { title, content, isPublic } = req.body;
      const note = await Note.create({ title, content, isPublic: !!isPublic, userId: req.user.id });
      res.status(201).json(note);
    } catch (err) { next(err); }
  });

  /**
 * @swagger
 * /api/v1/notes:
 *   post:
 *     tags: [Notes]
 *     summary: Create a new note (authenticated)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: My first note
 *               content:
 *                 type: string
 *                 example: Hello world
 *               isPublic:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       '201':
 *         description: Note created
 *       '400':
 *         description: Validation error
 *       '401':
 *         description: Unauthorized
 *
 *   get:
 *     tags: [Notes]
 *     summary: Get all notes for the logged user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Array of notes
 *       '401':
 *         description: Unauthorized
 */

// Read all (user's notes)
router.get('/', async (req, res, next) => {
  try {
    const notes = await Note.findAll({ where: { userId: req.user.id }});
    res.json(notes);
  } catch (err) { next(err); }
});

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   get:
 *     tags: [Notes]
 *     summary: Get a single note by id (owner or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Note object
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Not found
 *
 *   put:
 *     tags: [Notes]
 *     summary: Update a note by id (owner or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       '200': { description: Updated note }
 *       '401': { description: Unauthorized }
 *       '403': { description: Forbidden }
 *
 *   delete:
 *     tags: [Notes]
 *     summary: Delete a note by id (owner or admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200': { description: Deleted }
 *       '401': { description: Unauthorized }
 *       '403': { description: Forbidden }
 */
// Read single
router.get('/:id', async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (note.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    res.json(note);
  } catch (err) { next(err); }
});

// Update
router.put('/:id',
  body('title').optional().isString(),
  async (req, res, next) => {
    try {
      const note = await Note.findByPk(req.params.id);
      if (!note) return res.status(404).json({ message: 'Not found' });
      if (note.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
      await note.update(req.body);
      res.json(note);
    } catch (err) { next(err); }
  });

// Delete (owner or admin)
router.delete('/:id', async (req, res, next) => {
  try {
    const note = await Note.findByPk(req.params.id);
    if (!note) return res.status(404).json({ message: 'Not found' });
    if (note.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await note.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
