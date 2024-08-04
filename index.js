require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const penjualRoutes = require('./routes/penjualRoutes');
const pembeliRoutes = require('./routes/pembeliRoutes');
const produkRoutes = require('./routes/produkRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const midtransWebhookRoutes = require('./routes/midtransWebhookRoutes');
const pembayaranRoutes = require('./routes/pembayaranRoutes');
const protectedRoutes = require('./routes/protectedRoutes');
const paymentWebhookRoutes = require('./routes/paymentWebhookRoutes'); // Check this line

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use('/penjual', penjualRoutes);
app.use('/pembeli', pembeliRoutes);
app.use('/produk', produkRoutes);
app.use('/transaksi', transaksiRoutes);
app.use('/payment', paymentRoutes);
app.use('/webhook', webhookRoutes);
app.use('/midtransWebhook', midtransWebhookRoutes);
app.use('/pembayaran', pembayaranRoutes);
app.use('/protected', protectedRoutes);
app.use('/paymentWebhook', paymentWebhookRoutes); // Check this line

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
