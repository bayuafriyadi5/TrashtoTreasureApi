const express = require('express');
const router = express.Router();
const paymentMidtransController = require('../controllers/paymentMidtransController');
const paymentController = require('../controllers/paymentController');

router.get('/v1/invoices/', paymentMidtransController.createInvoice);
router.post('/v2/invoices/', paymentController.createInvoice);
router.get('/v2/invoices/:invoiceID', paymentController.getInvoice);


module.exports = router;
