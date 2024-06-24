const express = require('express');
const router = express.Router();
const penjualController = require('../controllers/penjualController');
const authenticateToken = require('../middleware/auth');

// Protect routes with `authenticateToken` middleware
router.get('/',  penjualController.getAllPenjual);
router.get('/find', authenticateToken, penjualController.findPenjualByEmail);
router.get('/:id_penjual', authenticateToken, penjualController.getPenjualById);
router.post('/', authenticateToken, penjualController.createPenjual);
router.post('/register', authenticateToken, penjualController.registerAsPenjual);
router.put('/', authenticateToken, penjualController.updatePenjual);
router.delete('/', authenticateToken, penjualController.deletePenjual);

module.exports = router;
