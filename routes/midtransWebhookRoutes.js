const express = require('express');
const router = express.Router();
const { Transaksi, Produk, Pembayaran } = require('../models'); // Ensure models are correctly imported

// Handle Midtrans webhook notifications
router.post('/midtrans-webhook', async (req, res) => {
    try {
        const notification = req.body;

        // Log the entire notification payload
        console.log('Received Midtrans webhook notification:', JSON.stringify(notification, null, 2));

        // Extract midtrans_invoice_id from the notification's metadata
        const midtrans_invoice_id = notification.metadata?.midtrans_invoice_id;

        // Log the midtrans_invoice_id
        console.log('Extracted midtrans_invoice_id:', midtrans_invoice_id);

        // Respond to Midtrans to acknowledge receipt
        res.status(200).send('Notification received');
    } catch (error) {
        console.error('Error handling Midtrans webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
