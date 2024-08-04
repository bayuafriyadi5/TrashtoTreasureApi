const express = require('express');
const router = express.Router();
const paymentMidtransController = require('../controllers/paymentMidtransController');
const paymentController = require('../controllers/paymentController');

router.post('/v1/invoices/create-invoices/', paymentMidtransController.createInvoice);
router.get('/v1/invoices/get-invoices/:invoice_number', paymentMidtransController.createInvoice);
router.post('/v2/invoices/', paymentController.createInvoice);
router.get('/v2/invoices/:invoiceID', paymentController.getInvoice);


module.exports = router;
