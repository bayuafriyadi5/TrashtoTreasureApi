const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Transaksi, Produk, Pembayaran } = require('../models'); // Include Pembayaran model

// Midtrans API credentials
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v1/invoices'; // Use production URL in live environment

// Helper function to get invoice data from Midtrans
const getInvoiceData = async (invoice_id) => {
    const config = {
        headers: {
            'Authorization': `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
        },
    };

    try {
        const res = await axios.get(`${MIDTRANS_API_URL}/${invoice_id}`, config);
        return res.data;
    } catch (error) {
        console.error('Error fetching invoice data:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// Helper function to update transaction status
const updateTransactionStatus = async (transaction, invoiceData) => {
    const { transaction_status, settlement_time, gross_amount, payment_type } = invoiceData;

    if (transaction_status === 'settlement') {
        // Update the transaction status to 'paid'
        await transaction.update({ status: 'paid' });

        // Insert a new Pembayaran record
        await Pembayaran.create({
            waktu_pembayaran: settlement_time,
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
        // Capture the notification data sent by Midtrans
        const notification = req.body;

        // Log the incoming request for debugging
        console.log('Midtrans Notification:', notification);

        // Fetch the transaction that corresponds to the invoice_id from the notification
        const transaction = await Transaksi.findOne({ where: { invoice_id: notification.invoice_id } });

        if (!transaction) {
            console.error('Transaction not found for invoice_id:', notification.invoice_id);
            return res.status(404).json({ status: 404, message: 'Transaction not found' });
        }

        // Fetch invoice data from Midtrans
        const invoiceData = await getInvoiceData(notification.invoice_id);

        // Update the transaction status based on the fetched invoice data
        await updateTransactionStatus(transaction, invoiceData);

        return res.status(200).json({ status: 200, message: 'Transaction statuses updated successfully' });
    } catch (error) {
        console.error('Error handling Midtrans webhook notification:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
});

module.exports = router;
