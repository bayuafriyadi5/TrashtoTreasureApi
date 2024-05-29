const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const authenticateToken = require('../middleware/auth');

router.get('/', produkController.getAllProduk);
router.get('/:id_produk', produkController.getProdukById);
router.get('/find', produkController.findProdukByName);
router.post('/', authenticateToken, produkController.createProduk);
router.put('/', authenticateToken, produkController.updateProduk);
router.delete('/', authenticateToken, produkController.deleteProduk);

module.exports = router;
