const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const Penjual = require('./penjual')(sequelize, Sequelize);
const Pembeli = require('./pembeli')(sequelize, Sequelize);
const Produk = require('./produk')(sequelize, Sequelize);
const Transaksi = require('./transaksi')(sequelize, Sequelize);
const Pembayaran = require('./pembayaran')(sequelize, Sequelize);


// Initialize associations
Produk.associate({ Penjual, Pembeli, Produk });
Penjual.associate({ Penjual, Pembeli, Produk });
Transaksi.associate({ Penjual, Pembeli, Produk });
Pembayaran.associate({ Penjual, Pembeli, Produk, Transaksi });


const models = {
    Penjual,
    Pembeli,
    Produk,
    Transaksi,
    Pembayaran,
};

const db = {
    Sequelize,
    sequelize,
    models,
};

module.exports = db;
module.exports = models;
