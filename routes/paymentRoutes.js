const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
// const paymentMidtransController = require('../controllers/paymentMidtransController');

router.post('/v2/invoices/', paymentController.createInvoice);
router.get('/v2/invoices/:invoiceID', paymentController.getInvoice);
// router.get('/v1/invoices', paymentMidtransController.createInvoice);


module.exports = router;
