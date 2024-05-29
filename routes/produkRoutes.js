const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const authenticateToken = require('../middleware/authenticateToken'); // ensure you have this middleware correctly pathed

// Public routes
router.get('/', produkController.getAllProduk);
router.get('/:id_produk', produkController.getProdukById);
router.get('/find', produkController.findProdukByName);

// Protected routes
router.post('/', authenticateToken, produkWprodukController.createProdukteProduk);
router.put('/', authenticateToken, produkController.updateProduk);
router.delete('/', authenticateToken, produkController.deleteProduk);

module.exports = router;
