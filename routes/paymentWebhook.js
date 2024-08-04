const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Transaksi, Produk, Pembayaran } = require('../models'); // Include Pembayaran model

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
    if (transaction.status === 'unpaid') {
        if (notification.transaction_status === 'settlement') {
            // Update the transaction status to 'paid'
            await transaction.update({ status: 'paid' });

            // Insert a new Pembayaran record
            await Pembayaran.create({
                waktu_pembayaran: formatDate(new Date(notification.settlement_time)),
                total_bayar: notification.gross_amount,
                metode_pembayaran: notification.payment_type,
                id_transaksi: transaction.id_transaksi
            });
        } else if (notification.transaction_status === 'expire') {
            // Handle the expired invoice case
            const produk = await Produk.findOne({ where: { id_produk: transaction.id_produk } });

            if (produk) {
                // Increase the stok_produk by the qty from the transaction
                produk.stok_produk += transaction.qty;
                await produk.save();
            }

            // Delete the transaction
            await transaction.destroy();
        }
    }
};

// Webhook endpoint for Midtrans payment notifications
router.post('/midtrans/notification', async (req, res) => {
    try {
        const notification = req.body;

        const transaction = await Transaksi.findOne({ where: { invoice_id: notification.order_id } });

        if (!transaction) {
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
