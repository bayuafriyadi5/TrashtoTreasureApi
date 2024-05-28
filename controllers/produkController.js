const { Sequelize, sequelize, Produk, Penjual } = require('../models'); // Import from db object
const response = require('../utils/response');
const multer = require('multer');
const path = require('path');
const bucket = require('../config/firebaseConfig'); // Import Firebase bucket

const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload an image.'), false);
        }
    },
    limits: { fileSize: 1024 * 1024 * 5 } // Limit file size to 5MB
});

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
            const foto_produk = req.file;

            // Validate that the provided id_penjual exists
            const penjual = await Penjual.findByPk(id_penjual);
            if (!penjual) {
                return response(400, null, "Penjual not found", res);
            }

            let foto_produk_url = null;
            if (foto_produk) {
                const blob = bucket.file(Date.now() + path.extname(foto_produk.originalname));
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: foto_produk.mimetype
                    }
                });

                blobStream.on('error', error => {
                    throw new Error('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', async () => {
                    // The public URL can be used to directly access the file via HTTP.
                    foto_produk_url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    const result = await Produk.create({ nama_produk, desc_produk, harga_produk, stok_produk, foto_produk: foto_produk_url, id_penjual });
                    response(200, result, "Successfully insert data", res);
                });

                blobStream.end(foto_produk.buffer);
            } else {
                const result = await Produk.create({ nama_produk, desc_produk, harga_produk, stok_produk, foto_produk: foto_produk_url, id_penjual });
                response(200, result, "Successfully insert data", res);
            }
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
            const foto_produk = req.file;

            // Validate that the provided id_penjual exists
            const penjual = await Penjual.findByPk(id_penjual);
            if (!penjual) {
                return response(400, null, "Penjual not found", res);
            }

            let foto_produk_url = null;
            if (foto_produk) {
                const blob = bucket.file(Date.now() + path.extname(foto_produk.originalname));
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: foto_produk.mimetype
                    }
                });

                blobStream.on('error', error => {
                    throw new Error('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', async () => {
                    // The public URL can be used to directly access the file via HTTP.
                    foto_produk_url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    const result = await Produk.update(
                        { nama_produk, desc_produk, harga_produk, stok_produk, foto_produk: foto_produk_url, id_penjual },
                        { where: { id_produk: id_produk } }
                    );

                    if (result[0]) {
                        response(200, { isSuccess: result[0] }, "Successfully update data", res);
                    } else {
                        response(404, "Produk not found", "error", res);
                    }
                });

                blobStream.end(foto_produk.buffer);
            } else {
                const result = await Produk.update(
                    { nama_produk, desc_produk, harga_produk, stok_produk, foto_produk: foto_produk_url, id_penjual },
                    { where: { id_produk: id_produk } }
                );

                if (result[0]) {
                    response(200, { isSuccess: result[0] }, "Successfully update data", res);
                } else {
                    response(404, "Produk not found", "error", res);
                }
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
