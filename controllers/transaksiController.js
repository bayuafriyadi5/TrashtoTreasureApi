const { Transaksi, Penjual, Pembeli } = require('../models'); // Import from db object
const response = require('../utils/response');

exports.getTransaksi = async (req, res) => {
    try {
        const result = await Transaksi.findAll({
            include: [
                { model: Penjual, as: 'penjual' },
                { model: Pembeli, as: 'pembeli' }
            ],
            logging: console.log
        });
        response(200, result, "Get all data from transaksi", res);
    } catch (error) {
        console.error("Error fetching data:", error);
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.getTransaksiById = async (req, res) => {
    try {
        const id_transaksi = req.params.id_transaksi;
        const result = await Transaksi.findByPk(id_transaksi, {
            include: [
                { model: Penjual, as: 'penjual' },
                { model: Pembeli, as: 'pembeli' }
            ]
        });
        response(200, result, "Search transaksi by id", res);
    } catch (error) {
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.createTransaksi = async (req, res) => {
    try {
        const { id_pembeli, total_harga, id_penjual, id_produk, qty } = req.body;
        const result = await Transaksi.create({ id_pembeli, total_harga, id_penjual, id_produk, qty });
        response(200, result, "Successfully inserted data", res);
    } catch (error) {
        response(500, { error: error.message }, "Error creating data", res);
    }
};

exports.updateTransaksi = async (req, res) => {
    try {
        const { id_transaksi, status, id_pembeli, total_harga, id_penjual, id_produk, qty, invoice_id, invoice_url } = req.body;
        const result = await Transaksi.update(
            { status, id_pembeli, total_harga, id_penjual, qty, invoice_id, id_produk, invoice_url },
            { where: { id_transaksi } }
        );
        if (result[0]) {
            response(200, { isSuccess: result[0] }, "Successfully updated data", res);
        } else {
            response(404, "Transaksi not found", "Error", res);
        }
    } catch (error) {
        response(500, { error: error.message }, "Error updating data", res);
    }
};

exports.deleteTransaksi = async (req, res) => {
    try {
        const { id_transaksi } = req.body;
        const result = await Transaksi.destroy({ where: { id_transaksi } });
        if (result) {
            response(200, { isDeleted: result }, "Successfully deleted data", res);
        } else {
            response(404, "Transaksi not found", "Error", res);
        }
    } catch (error) {
        response(500, { error: error.message }, "Error deleting data", res);
    }
};
