const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Transaksi, Produk } = require('../models'); // Include Produk model
const XENDIT_API_URL = 'https://api.xendit.co/v2/invoices';
const XENDIT_API_KEY = process.env.XENDIT_API_KEY;

console.log('Xendit Secret Key:', XENDIT_API_KEY);

const updateTransactionStatus = async (transaction, status) => {
    if (transaction.status === 'unpaid' && transaction.invoice_id && transaction.invoice_id !== '') {
        // Update the transaction status based on the payment status
        await transaction.update({ status: 'paid' });
    }
};

const getInvoiceStatus = async (invoiceID) => {
    const config = {
        auth: {
            username: XENDIT_API_KEY,
            password: '',
        },
    };

    try {
        const res = await axios.get(`${XENDIT_API_URL}/${invoiceID}`, config);
        return res.data.status;
    } catch (error) {
        console.error('Error in getInvoiceStatus:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

router.post('/xendit/invoice/status', async (req, res) => {
    try {
        const transactions = await Transaksi.findAll();

        if (!transactions || transactions.length === 0) {
            return res.status(404).json({ status: 404, message: 'No transactions found' });
        }

        for (const transaction of transactions) {
            if (transaction.invoice_id && transaction.invoice_id !== '') {
                const invoiceStatus = await getInvoiceStatus(transaction.invoice_id);
                if (invoiceStatus === 'SETTLED') {
                    await updateTransactionStatus(transaction, 'paid');
                } else if (invoiceStatus === 'EXPIRED') {
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
        }

        return res.status(200).json({ status: 200, message: 'Transaction statuses updated successfully' });
    } catch (error) {
        console.error('Error handling webhook invoice status:', error);
        return res.status(500).json({ status: 500, message: 'Internal server error' });
    }
});

module.exports = router;
