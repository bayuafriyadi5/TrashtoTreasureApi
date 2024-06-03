const axios = require('axios');
const crypto = require('crypto');
const response = require('../utils/response');
require('dotenv').config();

const XENDIT_API_URL = 'https://api.xendit.co/v2/invoices';
const XENDIT_API_KEY = process.env.XENDIT_API_KEY;

console.log('Xendit Secret Key:', XENDIT_API_KEY);

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

const getInvoice = async (invoiceID) => {
    const config = {
        auth: {
            username: XENDIT_API_KEY,
            password: '',
        },
    };

    try {
        const res = await axios.get(`${XENDIT_API_URL}/${invoiceID}`, config);
        return res.data;
    } catch (error) {
        console.error('Error in getInvoice:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};


exports.createInvoice = async (req, res) => {
    try {

        const { external_id, amount } = req.body;

        const data = {
            external_id,
            description: "Produk Daur Ulang",
            amount,
            currency: "IDR",
            invoice_duration: 360,
            reminder_time: 1,
        };

        const createdInvoice = await createInvoice(data);

        response(200, createdInvoice, 'Successfully created invoice', res);
    } catch (error) {
        console.error('Error creating invoice:', error.message);
        response(500, { error: error.message }, 'Error creating invoice', res);
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const { invoiceID } = req.params;

        const fetchedInvoice = await getInvoice(invoiceID);

        response(200, fetchedInvoice, 'Successfully fetched invoice', res);
    } catch (error) {
        console.error('Error fetching invoice:', error.message);
        response(500, { error: error.message }, 'Error fetching invoice', res);
    }
};


