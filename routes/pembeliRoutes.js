const express = require('express');
const router = express.Router();
const pembeliController = require('../controllers/pembeliController');
const authenticateToken = require('../middleware/auth');

router.get('/', pembeliController.getAllPembeli);
router.get('/find', pembeliController.findPembeliByName);
router.get('/getuser', authenticateToken, pembeliController.getPembeliById);
router.post('/register', pembeliController.registerPembeli);
router.post('/login', pembeliController.loginPembeli);
router.put('/', authenticateToken, pembeliController.updatePembeli);
router.put('/noimage', authenticateToken, pembeliController.updatePembeliWithoutImage);
router.delete('/', pembeliController.deletePembeli);

module.exports = router;
