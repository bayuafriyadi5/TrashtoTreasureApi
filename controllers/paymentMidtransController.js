const axios = require('axios');
const base64 = require('base-64');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Midtrans API URL and credentials
const MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v1/invoices';
const MIDTRANS_SERVER_KEY_PROD = process.env.MIDTRANS_SERVER_KEY_PROD;
const encodedKey = base64.encode(MIDTRANS_SERVER_KEY_PROD + ':');

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

// Helper function to create invoice
const createInvoice = async (data) => {
    const config = {
        headers: {
            'Authorization': `Basic ${encodedKey}`,
            'Content-Type': 'application/json',
        },
    };

    try {
        const res = await axios.post(MIDTRANS_API_URL, data, config);
        return res.data;
    } catch (error) {
        console.error('Error in createInvoice:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

// Helper function to get invoice
const getInvoice = async (invoiceID) => {
    const config = {
        headers: {
            'Authorization': `Basic ${encodedKey}`,
        },
    };

    try {
        const res = await axios.get(`${MIDTRANS_API_URL}/${invoiceID}`, config);
        return res.data;
    } catch (error) {
        console.error('Error in getInvoice:', error.response ? error.response.data : error.message);
        throw new Error(error.response ? error.response.data.message : error.message);
    }
};

exports.createInvoice = async (req, res) => {
    try {
        const { customer_details, gross_amount, item_details } = req.body;

        const order_id = uuidv4();
        const invoice_number = `INV-${Date.now()}`;
        const invoice_date = new Date();
        const due_date = new Date(invoice_date.getTime() + 24 * 60 * 60 * 1000);

        const data = {
            "payment_type": "payment_link",
            "order_id": order_id,
            "gross_amount": gross_amount,
            "invoice_number": invoice_number,
            "due_date": formatDate(due_date),
            "invoice_date": formatDate(invoice_date),
            "customer_details": customer_details,
            "item_details": item_details
        };

        const createdInvoice = await createInvoice(data);

        res.status(200).json({
            success: true,
            message: 'Successfully created invoice',
            data: createdInvoice
        });
    } catch (error) {
        console.error('Error creating invoice:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating invoice',
            error: error.message
        });
    }
};

exports.getInvoice = async (req, res) => {
    try {
        const { invoice_id } = req.params;

        const fetchedInvoice = await getInvoice(invoice_id);

        res.status(200).json({
            success: true,
            message: 'Successfully fetched invoice',
            data: fetchedInvoice
        });
    } catch (error) {
        console.error('Error fetching invoice:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoice',
            error: error.message
        });
    }
};
