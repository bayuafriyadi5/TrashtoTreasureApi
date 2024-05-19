const express = require('express');
const router = express.Router();
const pembeliController = require('../controllers/pembeliController');

router.get('/', pembeliController.getAllPembeli);
router.get('/find', pembeliController.findPembeliByName);
router.get('/:id_penjual', pembeliController.getPembeliById);
router.post('/', pembeliController.createPembeli);
router.put('/', pembeliController.updatePembeli);
router.delete('/', pembeliController.deletePembeli);

module.exports = router;
