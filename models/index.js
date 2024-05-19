const Sequelize = require('sequelize');
const sequelize = require('../config/db');


const Penjual = require('./penjual')(sequelize, Sequelize);
const Pembeli = require('./pembeli')(sequelize, Sequelize);
const Produk = require('./produk')(sequelize, Sequelize);

// Initialize associations
Produk.associate({ Penjual, Pembeli, Produk });
Penjual.associate({ Penjual, Pembeli, Produk });

const models = {
    Penjual,
    Pembeli,
    Produk,
};

const db = {
    Sequelize,
    sequelize,
    Penjual,
    Pembeli,
    Produk,
    models,
};


module.exports = db;
module.exports = models;