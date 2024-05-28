const express = require('express');
const router = express.Router();
const { Transaksi } = require('../models');

router.post('/xendit/invoice/status', async (req, res) => {
    try {
        // Fetch all transactions from the Transaksi table
        const transactions = await Transaksi.findAll();

        // Check if there are any transactions
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ status: 404, message: "No transactions found" });
        }

        // Iterate through each transaction and update its status based on conditions
        for (const transaction of transactions) {
            if (transaction.status === "unpaid" && transaction.invoice_id && transaction.invoice_id !== '') {
                // Update the transaction status based on the payment status
                await transaction.update({ status: "pending" });
            } else if (transaction.status !== "unpaid" && transaction.invoice_id && transaction.invoice_id !== '') {
                // Update the transaction status to "paid" if it's not "unpaid" and has a non-empty invoice ID
                await transaction.update({ status: "paid" });
            }
        }

        // Return success response
        return res.status(200).json({ status: 200, message: "Transaction statuses updated successfully" });
    } catch (error) {
        // Handle any errors and return an error response
        console.error("Error handling webhook invoice status:", error);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

module.exports = router;
