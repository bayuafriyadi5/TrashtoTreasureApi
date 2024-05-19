const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');

router.get('/', produkController.getAllProduk);
router.get('/:id_produk', produkController.getProdukById);
router.get('/find', produkController.findProdukByName);
router.post('/', produkController.createProduk);
router.put('/', produkController.updateProduk);
router.delete('/', produkController.deleteProduk);

module.exports = router;
