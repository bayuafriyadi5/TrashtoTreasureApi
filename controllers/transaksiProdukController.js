const { TransaksiProduk, Produk, Transaksi } = require('../models'); // Import from db object
const response = require('../utils/response');

exports.getTransaksiProduk = async (req, res) => {
    try {
        const result = await TransaksiProduk.findAll({
            include: [
                { model: Produk, as: 'produk' },
                { model: Transaksi, as: 'transaksi' }
            ],
            logging: console.log
        });
        response(200, result, "Get all data from transaksiProduk", res);
    } catch (error) {
        console.error("Error fetching data:", error);
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.getTransaksiProdukById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await TransaksiProduk.findByPk(id, {
            include: [
                { model: Produk, as: 'produk' },
                { model: Transaksi, as: 'transaksi' }
            ]
        });
        response(200, result, "Search transaksiProduk by id", res);
    } catch (error) {
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.createTransaksiProduk = async (req, res) => {
    try {
        const { id_produk, qty, id_transaksi, nama_produk, harga_produk, total_harga } = req.body;
        const result = await TransaksiProduk.create({ id_produk, qty, id_transaksi, nama_produk, harga_produk, total_harga });
        response(200, result, "Successfully inserted data", res);
    } catch (error) {
        response(500, { error: error.message }, "Error creating data", res);
    }
};

exports.updateTransaksiProduk = async (req, res) => {
    try {
        const { id, id_produk, qty, id_transaksi, nama_produk, harga_produk, total_harga } = req.body;
        const result = await TransaksiProduk.update(
            { id_produk, qty, id_transaksi, nama_produk, harga_produk, total_harga },
            { where: { id } }
        );
        if (result[0]) {
            response(200, { isSuccess: result[0] }, "Successfully updated data", res);
        } else {
            response(404, "TransaksiProduk not found", "Error", res);
        }
    } catch (error) {
        response(500, { error: error.message }, "Error updating data", res);
    }
};

exports.deleteTransaksiProduk = async (req, res) => {
    try {
        const { id } = req.body;
        const result = await TransaksiProduk.destroy({ where: { id } });
        if (result) {
            response(200, { isDeleted: result }, "Successfully deleted data", res);
        } else {
            response(404, "TransaksiProduk not found", "Error", res);
        }
    } catch (error) {
        response(500, { error: error.message }, "Error deleting data", res);
    }
};
