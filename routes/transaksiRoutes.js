const express = require('express');
const router = express.Router();
const transaksiController = require('../controllers/transaksiController');

router.get('/', transaksiController.getTransaksi);
router.get('/:id_transaksi', transaksiController.getTransaksiById);
router.post('/', transaksiController.createTransaksi);
router.put('/', transaksiController.updateTransaksi);
router.delete('/', transaksiController.deleteTransaksi);

module.exports = router;
