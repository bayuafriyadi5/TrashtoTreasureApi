const { Transaksi, Penjual, Pembeli, Produk } = require('../models'); // Import from db object
const response = require('../utils/response');

exports.getTransaksi = async (req, res) => {
    try {
        const result = await Transaksi.findAll({
            include: [
                { model: Penjual, as: 'penjual' },
                { model: Pembeli, as: 'pembeli' },
                { model: Produk, as: 'produk' }
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
                { model: Pembeli, as: 'pembeli' },
                { model: Produk, as: 'produk' }
            ]
        });
        response(200, result, "Search transaksi by id", res);
    } catch (error) {
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.createTransaksi = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const { id_pembeli, total_harga, id_penjual, id_produk, qty } = req.body;

        // Fetch the product to check stock
        const produk = await Produk.findByPk(id_produk, { transaction: t });
        if (!produk) {
            await t.rollback();
            return response(404, null, "Produk not found", res);
        }

        // Check if there is enough stock
        if (produk.stok_produk < qty) {
            await t.rollback();
            return response(400, null, "Not enough stock", res);
        }

        // Decrease the stock
        produk.stok_produk -= qty;
        await produk.save({ transaction: t });

        // Create the transaction
        const result = await Transaksi.create(
            { id_pembeli, total_harga, id_penjual, id_produk, qty },
            { transaction: t }
        );

        await t.commit();
        response(200, result, "Successfully inserted data", res);
    } catch (error) {
        await t.rollback();
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
        const transaksi = await Transaksi.findOne({ where: { id_transaksi } });

        if (!transaksi) {
            return response(404, "Transaksi not found", "Error", res);
        }

        // Check for related Produk records
        const produk = await Produk.findOne({ where: { id_produk: transaksi.id_produk } });

        if (produk) {
            // Handle the related Produk record as needed (e.g., delete, update, etc.)
            // Example: set the foreign key to null
            await Produk.update({ id_produk: null }, { where: { id_produk: produk.id_produk } });
        }

        // Now, delete the Transaksi record
        await transaksi.destroy();

        response(200, { isDeleted: true }, "Successfully deleted data", res);
    } catch (error) {
        console.error("Error deleting data:", error);
        response(500, { error: error.message }, "Error deleting data", res);
    }
};
