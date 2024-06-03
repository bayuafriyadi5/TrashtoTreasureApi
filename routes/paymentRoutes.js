const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/v2/invoices/', paymentController.createInvoice);
router.get('/v2/invoices/:invoiceID', paymentController.getInvoice);
router.get('/v2/invoices/find', paymentController.getInvoiceByExternalId);

module.exports = router;
