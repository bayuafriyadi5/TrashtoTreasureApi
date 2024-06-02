const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const authenticateToken = require('../middleware/auth');

router.get('/', authenticateToken, produkController.getAllProduk);
router.get('/:id_produk', produkController.getProdukById);
router.get('/find', authenticateToken, produkController.findProdukByName);
router.get('/findpenjual', authenticateToken, produkController.findProdukByPenjual);
router.post('/', authenticateToken, produkController.createProduk);
router.put('/', authenticateToken, produkController.updateProduk);
router.delete('/', authenticateToken, produkController.deleteProduk);

module.exports = router;
