const express = require('express');
const router = express.Router();
const { Transaksi, Pembayaran } = require('../models'); // Ensure models are correctly imported

// Handle Midtrans webhook notifications
router.post('/midtrans-webhook', async (req, res) => {
    try {
        const notification = req.body;

        console.log('Received Midtrans webhook notification:', notification);

        // Extract necessary details from the notification
        const { transaction_status, invoice_id, payment_type } = notification;

        // Find the transaction using invoice_id
        const transaction = await Transaksi.findOne({ where: { invoice_id } });

        if (transaction) {
            if (transaction_status === 'settlement') {
                // Update transaction status to 'paid'
                await transaction.update({ status: 'paid' });

                // Create a new Pembayaran record
                if (notification.paid_at) {
                    await Pembayaran.create({
                        waktu_pembayaran: notification.paid_at,
                        total_bayar: notification.gross_amount,
                        metode_pembayaran: payment_type, // Assuming this field exists in the notification
                        id_transaksi: transaction.id_transaksi
                    });
                } else {
                    console.error('Error: paid_at field is missing or null in notification');
                }
            } else if (transaction_status === 'cancelled') {
                // Handle cancelled transactions (optional)
                await transaction.update({ status: 'cancelled' });
            }

            // Respond to Midtrans to acknowledge receipt
            res.status(200).send('Notification received');
        } else {
            console.error('Transaction not found for invoice_id:', invoice_id);
            res.status(404).send('Transaction not found');
        }
    } catch (error) {
        console.error('Error handling Midtrans webhook:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

