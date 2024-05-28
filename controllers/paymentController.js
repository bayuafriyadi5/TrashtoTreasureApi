const axios = require('axios');
const crypto = require('crypto');
const response = require('../utils/response');
require('dotenv').config();

const XENDIT_API_URL = 'https://api.xendit.co/v2/invoices';
const XENDIT_API_KEY = process.env.XENDIT_API_KEY;

const { Transaksi } = require('../models'); // Import Transaksi model

const createInvoice = async (data) => {
    const config = {
        auth: {
            username: XENDIT_API_KEY,
            password: '',
        },
        headers: {
            'Content-Type': 'application/json',
        },
    };

    try {
        const res = await axios.post(XENDIT_API_URL, data, config);
        return res.data;
    } catch (error) {
        console.error('Error in createInvoice:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

exports.createInvoice = async (req, res) => {
    const t = await Transaksi.sequelize.transaction();
    try {
        const { id_pembeli, total_harga, id_penjual, qty } = req.body;
        const randomString = crypto.randomBytes(4).toString('hex');

        // Create a Transaksi entry first
        const newTransaksi = await Transaksi.create({
            id_pembeli,
            total_harga,
            id_penjual,
            qty,
        }, { transaction: t });

        const data = {
            external_id: `invoice-${randomString}`,
            description: "Produk Daur Ulang",
            amount: total_harga,
            currency: "IDR",
            invoice_duration: 3600,
            reminder_time: 1,
        };

        // Create the invoice with Xendit
        const createdInvoice = await createInvoice(data);

        // Update the Transaksi entry with the invoice details
        await newTransaksi.update({
            invoice_id: createdInvoice.id,
            invoice_url: createdInvoice.invoice_url,
        }, { transaction: t });

        await t.commit();

        response(200, createdInvoice, 'Successfully created invoice and updated transaksi', res);
    } catch (error) {
        await t.rollback();
        console.error('Error creating invoice:', error.message);
        response(500, { error: error.message }, 'Error creating invoice', res);
    }
};
