const midtransClient = require('midtrans-client');

// Initialize the Midtrans client
const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: 'Mid-server-pBJxkUUyfw1z8mladQxCagnp',
    clientKey: 'Mid-client-cCxsOivlg7w341XQ'
});

// Create Invoice
exports.createInvoice = async (req, res) => {
    const { orderId, grossAmount, customerDetails } = req.body;

    try {
        const parameter = {
            "payment_type": "bank_transfer",
            "transaction_details": {
                "order_id": orderId,
                "gross_amount": grossAmount
            },
            "customer_details": customerDetails,
            "item_details": [
                {
                    "id": "item01",
                    "price": grossAmount,
                    "quantity": 1,
                    "name": "A product"
                }
            ]
        };

        const response = await coreApi.charge(parameter);
        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get Invoice
exports.getInvoice = async (req, res) => {
    const { invoiceID } = req.params;

    try {
        const response = await coreApi.transaction.status(invoiceID);
        res.json(response);
    } catch (error) {
        res.status(500).send(error);
    }
};
