const express = require('express');
const bodyParser = require('body-parser');

const penjualRoutes = require('./routes/penjualRoutes');
const pembeliRoutes = require('./routes/pembeliRoutes');
const produkRoutes = require('./routes/produkRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const webhookRoutes = require('./routes/webhookRoutes');
const pembayaranRoutes = require('./routes/pembayaranRoutes');

const port = 3000;

const app = express();

app.use(bodyParser.json());
app.use('/penjual', penjualRoutes);
app.use('/pembeli', pembeliRoutes);
app.use('/produk', produkRoutes);
app.use('/transaksi', transaksiRoutes);
app.use('/payment', paymentRoutes);
app.use('/webhook', webhookRoutes);
app.use('/pembayaran', pembayaranRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
