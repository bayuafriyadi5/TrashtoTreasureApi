const { Sequelize, sequelize, Produk, Penjual } = require('../models'); // Import from db object
const response = require('../utils/response');
const upload = require('../utils/multer'); // Adjust the path as necessary

exports.getAllProduk = async (req, res) => {
    try {
        const result = await Produk.findAll({
            include: [{ model: Penjual, as: 'penjual' }],
            logging: console.log
        });
        response(200, result, "get all data from produk", res);
    } catch (error) {
        console.error("Error fetching data:", error);
        response(500, { error: error.message }, "Error fetching data", res);
    }
};

exports.getProdukById = async (req, res) => {
    try {
        const id_produk = req.params.id_produk;
        const result = await Produk.findByPk(id_produk, {
            include: { model: Penjual, as: 'penjual' }
        });
        response(200, result, "search produk id", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.findProdukByName = async (req, res) => {
    try {
        const result = await Produk.findOne({
            where: { nama_produk: req.query.nama_produk },
            include: { model: Penjual, as: 'penjual' }
        });
        response(200, result, "search produk name", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.createProduk = [
    upload.single('foto_produk'),
    async (req, res) => {
        try {
            const { nama_produk, desc_produk, harga_produk, stok_produk, id_penjual } = req.body;
            const foto_produk = req.file ? req.file.filename : null;

            // Validate that the provided id_penjual exists
            const penjual = await Penjual.findByPk(id_penjual);
            if (!penjual) {
                return response(400, null, "Penjual not found", res);
            }

            const result = await Produk.create({
                nama_produk,
                desc_produk,
                harga_produk,
                stok_produk,
                foto_produk,
                id_penjual
            });
            response(200, result, "Successfully inserted data", res);
        } catch (error) {
            response(500, error, "error", res);
        }
    }
];

exports.updateProduk = [
    upload.single('foto_produk'),
    async (req, res) => {
        try {
            const { id_produk, nama_produk, desc_produk, harga_produk, stok_produk, id_penjual } = req.body;
            const foto_produk = req.file ? req.file.filename : null;

            // Validate that the provided id_penjual exists
            const penjual = await Penjual.findByPk(id_penjual);
            if (!penjual) {
                return response(400, null, "Penjual not found", res);
            }

            const result = await Produk.update(
                { nama_produk, desc_produk, harga_produk, stok_produk, foto_produk, id_penjual },
                { where: { id_produk: id_produk } }
            );

            if (result[0]) {
                response(200, { isSuccess: result[0] }, "Successfully update data", res);
            } else {
                response(404, "Produk not found", "error", res);
            }
        } catch (error) {
            response(500, error, "error", res);
        }
    }
];

exports.deleteProduk = async (req, res) => {
    try {
        const { id_produk } = req.body;
        const result = await Produk.destroy({ where: { id_produk: id_produk } });
        if (result) {
            response(200, { isDeleted: result }, "Successfully delete data", res);
        } else {
            response(404, "Produk not found", "error", res);
        }
    } catch (error) {
        response(500, error, "error", res);
    }
};
