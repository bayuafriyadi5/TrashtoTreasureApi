const express = require('express');
const router = express.Router();
const { Transaksi } = require('../models');

router.post('/xendit/invoice/status', async (req, res) => {
    try {
        const { id, status } = req.body;

        const transaksi = await Transaksi.findOne({ where: { invoice_id: id } });

        if (!transaksi) {
            return res.status(404).json({ status: 404, message: "Invoice not found" });
        }

        if (transaksi.status === "unpaid" && status === "PAID") {
            // Update the status to "pending" if the invoice was unpaid and now is paid
            await transaksi.update({ status: "pending" });
        } else {
            // Return error response if the invoice has been paid already
            return res.status(403).json({ status: 403, message: "Invoice has been paid" });
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
