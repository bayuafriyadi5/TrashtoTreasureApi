const express = require('express');
const router = express.Router();
const { Transaksi } = require('../models');

router.post('/xendit/invoice/status', async (req, res) => {
    try {
        const { invoice_id, status } = req.body;

        // Check if the id and status are provided in the request
        if (!invoice_id || !status) {
            return res.status(400).json({ status: 400, message: "Missing invoice id or status" });
        }

        // Find the transaction with the given invoice_id
        const transaksi = await Transaksi.findOne({ where: { invoice_id: invoice_id } });
        console.log(invoice_id)

        // Check if the transaction exists
        if (!transaksi) {
            return res.status(404).json({ status: 404, message: "Invoice not found" });
        }

        // Update the transaction status based on the payment status
        if (transaksi.status === "unpaid" && status === "PAID") {
            await transaksi.update({ status: "pending" });
        } else if (transaksi.status !== "unpaid") {
            return res.status(403).json({ status: 403, message: "Invoice has already been processed" });
        } else {
            return res.status(400).json({ status: 400, message: "Invalid status transition" });
        }

        // Return success response
        return res.status(200).json({ status: 200, data: req.body });
    } catch (error) {
        // Handle any errors and return an error response
        console.error("Error handling webhook invoice status:", error);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
});

module.exports = router;
