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
    const { order_id, invoice_number, due_date, invoice_date, customer_details, gross_amount } = req.body;

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
            "item_details": [
                {
                    "id": "item01",
                    "price": gross_amount,
                    "quantity": 1,
                    "name": "A product"
                }
            ]
        };

        // Make the request with the Authorization header
        const response = await coreApi.charge(parameter, {
            headers: {
                'Authorization': 'Basic ' + encodedKey
            }
        });

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
        const response = await coreApi.transaction.status(invoiceID, {
            headers: {
                'Authorization': 'Basic ' + encodedKey
            }
        });

        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
};
