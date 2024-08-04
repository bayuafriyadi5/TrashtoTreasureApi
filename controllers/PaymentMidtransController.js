const midtransClient = require('midtrans-client');
const base64 = require('base-64');

// Your server key
const serverKey = 'Mid-server-pBJxkUUyfw1z8mladQxCagnp';
const encodedKey = base64.encode(serverKey + ':');

// Initialize the Midtrans client
const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: serverKey,
    clientKey: 'Mid-client-cCxsOivlg7w341XQ'
});

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

        // Make the request with the Authorization header
        const midtransResponse = await coreApi.charge(parameter, {
            headers: {
                'Authorization': 'Basic ' + encodedKey
            }
        });

        const response = {
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

        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get Invoice
exports.getInvoice = async (req, res) => {
    const { invoiceID } = req.params;

    try {
        // Make the request with the Authorization header
        const midtransResponse = await coreApi.transaction.status(invoiceID, {
            headers: {
                'Authorization': 'Basic ' + encodedKey
            }
        });

        const response = {
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

        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
};