const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, transaksiController.getTransaksi);
router.get('/findpembeli', authenticateToken, transaksiController.findTransaksiByPembeli);
router.get('/findpenjual', authenticateToken, transaksiController.findTransaksiByPenjual);
router.get('/:id_transaksi', transaksiController.getTransaksiById);
router.post('/', authenticateToken, transaksiController.createTransaksi);
router.put('/updateinvoice', authenticateToken, transaksiController.updateTransaksiInvoice);
router.put('/', authenticateToken, transaksiController.updateTransaksi);
router.delete('/', authenticateToken, transaksiController.deleteTransaksi);

module.exports = router;
