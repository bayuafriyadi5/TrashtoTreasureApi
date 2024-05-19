const express = require('express');
const bodyParser = require('body-parser');
const penjualRoutes = require('./routes/penjualRoutes');
const pembeliRoutes = require('./routes/pembeliRoutes');
const produkRoutes = require('./routes/produkRoutes');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use('/penjual', penjualRoutes);
app.use('/pembeli', pembeliRoutes);
app.use('/produk', produkRoutes);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
