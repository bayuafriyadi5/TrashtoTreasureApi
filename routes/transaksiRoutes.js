const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const authenticateToken = require('../middleware/auth');

router.get('/', transaksiController.getTransaksi);
router.get('/:id_transaksi', transaksiController.getTransaksiById);
router.post('/', authenticateToken, transaksiController.createTransaksi);
router.put('/', transaksiController.updateTransaksi);
router.delete('/', authenticateToken, transaksiController.deleteTransaksi);

module.exports = router;
