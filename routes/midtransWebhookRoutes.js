const express = require('express');
const router = express.Router();

// Handle Midtrans webhook notifications
router.post('/midtrans-webhook', (req, res) => {
    // Extract data from the request
    const notification = req.body;

    // Process the notification data
    console.log('Received Midtrans webhook notification:', notification);

    // Example: Check the notification's transaction status
    if (notification.transaction_status === 'settlement') {
        // Handle the settlement
        console.log('Transaction is settled.');
    } else if (notification.transaction_status === 'pending') {
        // Handle pending transactions
        console.log('Transaction is pending.');
    } else if (notification.transaction_status === 'cancelled') {
        // Handle cancelled transactions
        console.log('Transaction is cancelled.');
    }

    // Respond to Midtrans to acknowledge receipt
    res.status(200).send('Notification received');
});

module.exports = router;
