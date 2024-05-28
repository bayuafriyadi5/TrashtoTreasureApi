const express = require('express');
const router = express.Router();
const pembayaranController = require('../controllers/pembayaranController');

router.get('/', pembayaranController.getAllPembayaran);
router.get('/:id_pembayaran', pembayaranController.getPembayaranById);

module.exports = router;
