const express = require('express');
const router = express.Router();

// Webhook handler for Xendit invoices
router.post('/webhooks/xendit/invoices', async (req, res) => {
    try {
        console.log('Received webhook from Xendit:', req.body);

        const eventType = req.body.event;
        const invoice = req.body.data;

        switch (eventType) {
            case 'invoice.paid':
                // Handle paid invoice
                await handlePaidInvoice(invoice);
                break;
            case 'invoice.expired':
                // Handle expired invoice
                await handleExpiredInvoice(invoice);
                break;
            // Add more cases as needed for other invoice-related events
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        // Responding to Xendit immediately after receiving the webhook
        res.status(200).send({ message: 'Webhook received successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).send({ error: 'Failed to process webhook' });
    }
});

async function handlePaidInvoice(invoice) {
    // Logic to handle a paid invoice
    console.log('Handling paid invoice:', invoice);
    // Implement your logic here, like updating database records, notifying users, etc.
}

async function handleExpiredInvoice(invoice) {
    // Logic to handle an expired invoice
    console.log('Handling expired invoice:', invoice);
    // Implement your logic here
}

module.exports = router;
