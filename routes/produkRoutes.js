const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, produkController.getAllProduk);
router.get('/find', authenticateToken, produkController.findProdukByName);
router.get('/findpenjual', authenticateToken, produkController.findProdukByPenjual);
router.get('/:id_produk', authenticateToken, produkController.getProdukById);
router.post('/', authenticateToken, produkController.createProduk);
router.put('/:id_produk', authenticateToken, produkController.updateProduk);
router.put('/noimage/:id_produk', authenticateToken, produkController.updateProdukWithoutImage);
router.delete('/', authenticateToken, produkController.deleteProduk);

module.exports = router;
