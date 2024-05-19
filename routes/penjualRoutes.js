const express = require('express');
const router = express.Router();
const penjualController = require('../controllers/penjualController');

router.get('/', penjualController.getAllPenjual);
router.get('/find', penjualController.findPenjualByName);
router.get('/:id_penjual', penjualController.getPenjualById);
router.post('/', penjualController.createPenjual);
router.put('/', penjualController.updatePenjual);
router.delete('/', penjualController.deletePenjual);

module.exports = router;
