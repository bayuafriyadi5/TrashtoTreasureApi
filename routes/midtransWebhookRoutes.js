const express = require('express');
const axios = require('axios');
const { Transaksi, Produk, Pembayaran } = require('../models');
const router = express.Router();

// Midtrans API URL and credentials
const MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v1/invoices'; // Use production URL for production environment
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;

// Helper function to format date in the required format
const formatDate = (date) => {
    const pad = (num) => (num < 10 ? '0' : '') + num;
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const offsetHours = pad(Math.floor(Math.abs(offset) / 60));
    const offsetMinutes = pad(Math.abs(offset) % 60);
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${sign}${offsetHours}${offsetMinutes}`;
};

// Helper function to update transaction status
const updateTransactionStatus = async (transaction, notification) => {
    const { transaction_status, settlement_time, gross_amount, payment_type } = notification;

    if (transaction_status === 'settlement') {
        // Update the transaction status to 'paid'
        await transaction.update({ status: 'paid' });

        // Insert a new Pembayaran record
        await Pembayaran.create({
            waktu_pembayaran: formatDate(new Date(settlement_time)),
            total_bayar: gross_amount,
            metode_pembayaran: payment_type,
            id_transaksi: transaction.id_transaksi
        });
    } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
        // Handle the failed/expired invoice case
        const produk = await Produk.findOne({ where: { id_produk: transaction.id_produk } });

        if (produk) {
            // Increase the stok_produk by the qty from the transaction
            produk.stok_produk += transaction.qty;
            await produk.save();
        }

        // Delete the transaction
        await transaction.destroy();
    } else if (transaction_status === 'pending') {
        // Update the transaction status to 'pending'
        await transaction.update({ status: 'pending' });
    }
};

// Webhook endpoint for Midtrans payment notifications
router.post('/midtrans/notification', async (req, res) => {
    try {
        const notification = req.body;

        // Log the incoming request for debugging
        console.log('Midtrans Notification:', notification);

        // Validate notification signature
        const notificationSignature = req.headers['x-signature'];
        const validSignature = generateSignature(notification); // Implement your signature validation function

        if (!validSignature) {
            return res.status(400).json({ status: 400, message: 'Invalid signature' });
        }

        const transaction = await Transaksi.findOne({ where: { invoice_id: notification.order_id } });

        if (!transaction) {
            console.error('Transaction not found for invoice_id:', notification.order_id);
            return res.status(404).json({ status: 404, message: 'Transaction not found' });
        }

        await updateTransactionStatus(transaction, notification);

        return res.status(200).json({ status: 200, message: 'Transaction status updated successfully' });
    } catch (error) {
        console.error('Error handling Midtrans webhook notification:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
});

module.exports = router;

// Helper function to generate and validate signature
const generateSignature = (notification) => {
    // Generate and validate the signature according to Midtrans' documentation
    // This involves creating a hash of the notification data using your server key
    // and comparing it with the signature sent in the request headers
};
