const express = require('express');
const router = express.Router();
const pembeliController = require('../controllers/pembeliController');
const authenticateToken = require('../middleware/auth');

router.get('/', pembeliController.getAllPembeli);
router.get('/find', pembeliController.findPembeliByName);
router.get('/', authenticateToken, pembeliController.getPembeliByToken);
router.post('/register', pembeliController.registerPembeli);
router.post('/login', pembeliController.loginPembeli);
router.put('/', authenticateToken, pembeliController.updatePembeli);
router.delete('/', pembeliController.deletePembeli);

module.exports = router;
