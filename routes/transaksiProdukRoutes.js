const express = require('express');
const router = express.Router();
const transaksiProdukController = require('../controllers/transaksiProdukController');

router.get('/', transaksiProdukController.getTransaksiProduk);
router.get('/:id', transaksiProdukController.getTransaksiProdukById);
router.post('/', transaksiProdukController.createTransaksiProduk);
router.put('/', transaksiProdukController.updateTransaksiProduk);
router.delete('/', transaksiProdukController.deleteTransaksiProduk);

module.exports = router;
