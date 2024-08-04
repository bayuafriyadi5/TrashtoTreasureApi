const axios = require('axios');
const base64 = require('base-64');

// Your server key
const serverKey = 'Mid-server-pBJxkUUyfw1z8mladQxCagnp';
const encodedKey = base64.encode(serverKey + ':');

// Define the base URL for the Midtrans API
const MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v1'; 

// Create Invoice
exports.createInvoice = async (req, res) => {
    const { order_id, invoice_number, due_date, invoice_date, customer_details, gross_amount, item_details } = req.body;

    try {
        const parameter = {
            "payment_type": "bank_transfer",
            "transaction_details": {
                "order_id": order_id,
                "gross_amount": gross_amount
            },
            "custom_field1": invoice_number,
            "custom_field2": due_date,
            "custom_field3": invoice_date,
            "customer_details": customer_details,
            "item_details": item_details
        };

        // Make the request to Midtrans API
        const response = await axios.post(
            `${MIDTRANS_API_URL}/charge`,
            parameter,
            {
                headers: {
                    'Authorization': 'Basic ' + encodedKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        const midtransResponse = response.data;

        const invoiceResponse = {
            "order_id": order_id,
            "invoice_number": invoice_number,
            "published_date": new Date().toISOString(),
            "due_date": due_date,
            "invoice_date": invoice_date,
            "reference": "reference", // Add appropriate reference
            "customer_details": {
                "id": "customer_id", // Add appropriate customer ID
                "name": customer_details.first_name + ' ' + customer_details.last_name,
                "email": customer_details.email,
                "phone": customer_details.phone
            },
            "item_details": item_details,
            "id": midtransResponse.transaction_id,
            "status": midtransResponse.transaction_status,
            "gross_amount": gross_amount,
            "pdf_url": "https://assets.midtrans.com/invoices/pdf/" + midtransResponse.transaction_id, // Modify if needed
            "payment_type": midtransResponse.payment_type,
            "virtual_accounts": midtransResponse.va_numbers || [],
            "payment_link_url": midtransResponse.redirect_url
        };

        res.json(invoiceResponse);
    } catch (error) {
        console.error('Error creating invoice:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : { error: 'An error occurred while creating the invoice' });
    }
};

// Get Invoice
exports.getInvoice = async (req, res) => {
    const { invoiceID } = req.params;

    try {
        // Make the request to Midtrans API
        const response = await axios.get(
            `${MIDTRANS_API_URL}/status/${invoiceID}`,
            {
                headers: {
                    'Authorization': 'Basic ' + encodedKey
                }
            }
        );

        const midtransResponse = response.data;

        const invoiceResponse = {
            "order_id": midtransResponse.order_id,
            "invoice_number": midtransResponse.custom_field1,
            "published_date": new Date().toISOString(),
            "due_date": midtransResponse.custom_field2,
            "invoice_date": midtransResponse.custom_field3,
            "reference": "reference", // Add appropriate reference
            "customer_details": {
                "id": "customer_id", // Add appropriate customer ID
                "name": midtransResponse.customer_details.first_name + ' ' + midtransResponse.customer_details.last_name,
                "email": midtransResponse.customer_details.email,
                "phone": midtransResponse.customer_details.phone
            },
            "item_details": midtransResponse.item_details,
            "id": midtransResponse.transaction_id,
            "status": midtransResponse.transaction_status,
            "gross_amount": midtransResponse.gross_amount,
            "pdf_url": "https://assets.midtrans.com/invoices/pdf/" + midtransResponse.transaction_id, // Modify if needed
            "payment_type": midtransResponse.payment_type,
            "virtual_accounts": midtransResponse.va_numbers || [],
            "payment_link_url": midtransResponse.redirect_url
        };

        res.json(invoiceResponse);
    } catch (error) {
        console.error('Error getting invoice:', error.response ? error.response.data : error.message);
        res.status(500).send(error.response ? error.response.data : { error: 'An error occurred while retrieving the invoice' });
    }
};
