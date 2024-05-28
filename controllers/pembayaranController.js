const { Pembayaran, Transaksi, Penjual, Pembeli, Produk } = require('../models'); // Import from db object
const response = require('../utils/response');

exports.getAllPembayaran = async (req, res) => {
    try {
        const result = await Pembayaran.findAll({
            include: [
                { model: Transaksi, as: 'transaksi' },

            ],
            logging: console.log
        });
        response(200, result, "Get all data from pembayaran", res);
    } catch (error) {
        console.error("Error fetching data:", error);
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.getPembayaranById = async (req, res) => {
    try {
        const id_pembayaran = req.params.id_pembayaran;
        const result = await Pembayaran.findByPk(id_pembayaran, {
            include: [
                { model: Transaksi, as: 'transaksi' },

            ]
        });
        response(200, result, "Search transaksi by id", res);
    } catch (error) {
        response(500, { error: error.message }, "Error fetching data", res);
    }
};