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

exports.findTransaksiByPembeli = async (req, res) => {
    try {
        const { id_pembeli } = req.query;
        if (!id_pembeli) {
            return response(400, null, "Buyer ID is required", res);
        }

        const result = await Transaksi.findAll({
            where: { id_pembeli },
            include: [
                { model: Pembeli, as: 'pembeli' },
                { model: Penjual, as: 'penjual' }, // Include related Penjual if needed
                { model: Produk, as: 'produk' } // Include related Produk if needed
            ]
        });

        if (result.length === 0) {
            return response(404, null, "Transaksi for this buyer not found", res);
        }

        response(200, result, "Search Transaksi by buyer", res);
    } catch (error) {
        console.error("Error fetching transaksi by buyer:", error);
        response(500, { error: error.message }, "Error", res);
    }
};


exports.findTransaksiByPenjual = async (req, res) => {
    try {
        const { id_penjual } = req.query;
        if (!id_penjual) {
            return response(400, null, "Penjual ID is required", res);
        }

        const result = await Transaksi.findAll({
            where: { id_penjual },
            include: [
                { model: Penjual, as: 'penjual' },
                { model: Pembeli, as: 'pembeli' }, // Include related Pembeli if needed
                { model: Produk, as: 'produk' } // Include related Produk if needed
            ]
        });

        if (result.length === 0) {
            return response(404, null, "Transaksi for this seller not found", res);
        }

        response(200, result, "Search Transaksi by penjual", res);
    } catch (error) {
        console.error("Error fetching Transaksi by seller:", error);
        response(500, { error: error.message }, "Error", res);
    }
};


exports.createTransaksi = async (req, res) => {
    try {
        const { total_harga, id_produk, id_penjual, qty, invoice_id, invoice_url, alamat, status_pesanan } = req.body;

        // Fetch the associated Produk record
        const produk = await Produk.findOne({ where: { id_produk } });

        if (!produk) {
            return response(404, { error: "Produk not found" }, "Error creating data", res);
        }

        if (produk.stok_produk < qty) {
            return response(400, { error: "Insufficient stock" }, "Error creating data", res);
        }

        // Decrease the stok_produk
        produk.stok_produk -= qty;
        await produk.save();

        const pembeli = req.pembeli;

        if (!pembeli) {
            return response(403, { error: "Unauthorized" }, "Only authenticated users can create transactions", res);
        }

        // Create the Transaksi record
        const result = await Transaksi.create({
            id_pembeli: pembeli.id_pembeli,
            total_harga,
            id_penjual,
            id_produk,
            qty,
            invoice_id,
            invoice_url,
            alamat,
            status_pesanan: "Disiapkan"
        });

        response(200, result, "Successfully inserted data", res);
    } catch (error) {
        response(500, { error: error.message }, "Error creating data", res);
    }

};

exports.updateTransaksi = async (req, res) => {
    try {
        const { id_transaksi, status, id_pembeli, total_harga, id_penjual, id_produk, qty, invoice_id, invoice_url, alamat } = req.body;
        const result = await Transaksi.update(
            { status, id_pembeli, total_harga, id_penjual, qty, invoice_id, id_produk, invoice_url, alamat },
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

exports.updateTransaksiInvoice = async (req, res) => {
    try {
        const { id_transaksi, invoice_id, invoice_url, status_pesanan } = req.body;
        const result = await Transaksi.update(
            { invoice_id, invoice_url, status_pesanan },
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
