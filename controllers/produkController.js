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
        const { nama_produk } = req.query;

        if (!nama_produk) {
            return response(400, null, "Product name is required", res);
        }

        const result = await Produk.findOne({
            where: { nama_produk },
            include: { model: Penjual, as: 'penjual' }
        });

        if (!result) {
            return response(404, null, "Product not found", res);
        }

        response(200, result, "search produk name", res);
    } catch (error) {
        console.error("Error fetching product by name:", error);
        response(500, error, "error", res);
    }
};


exports.findProdukByPenjual = async (req, res) => {
    try {
        const { id_penjual } = req.query;

        if (!id_penjual) {
            return response(400, null, "Seller ID is required", res);
        }

        const result = await Produk.findAll({
            where: { id_penjual },
            include: { model: Penjual, as: 'penjual' }
        });

        if (result.length === 0) {
            return response(404, null, "Products for this seller not found", res);
        }

        response(200, result, "Search Produk by penjual", res);
    } catch (error) {
        console.error("Error fetching products by seller:", error);
        response(500, error, "Error", res);
    }
};

exports.createProduk = [
    upload.single('foto_produk'),
    async (req, res) => {
        try {
            if (!req.penjual) {
                return response(403, null, "Unauthorized: Only sellers can add products", res);
            }

            const { nama_produk, desc_produk, harga_produk, stok_produk } = req.body;
            const foto_produk = req.file;

            // Validate that the provided id_penjual exists
            const penjual = await Penjual.findByPk(req.penjual.id_penjual);
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
                    response(500, { error: error.message }, "Error uploading image", res);
                });

                blobStream.on('finish', async () => {
                    const downloadToken = await blob.getSignedUrl({
                        action: 'read',
                        expires: '01-01-2030' // Adjust the expiration date as needed
                    });

                    foto_produk_url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media&token=${downloadToken}`;

                    const result = await Produk.create({
                        nama_produk,
                        desc_produk,
                        harga_produk,
                        stok_produk,
                        foto_produk: foto_produk_url,
                        id_penjual: req.penjual.id_penjual
                    });
                    response(200, result, "Successfully insert data", res);
                });

                blobStream.end(foto_produk.buffer);
            } else {
                const result = await Produk.create({
                    nama_produk,
                    desc_produk,
                    harga_produk,
                    stok_produk,
                    foto_produk: foto_produk_url,
                    id_penjual: req.penjual.id_penjual
                });
                response(200, result, "Successfully insert data", res);
            }
        } catch (error) {
            response(500, { error: error.message }, "error", res);
        }
    }
];

exports.updateProduk = [
    upload.single('foto_produk'),
    async (req, res) => {
        try {
            if (!req.penjual) {
                return response(403, null, "Unauthorized: Only sellers can update products", res);
            }

            const { id_produk } = req.params;
            const { nama_produk, desc_produk, harga_produk, stok_produk } = req.body;
            const foto_produk = req.file;

            // Validate that the provided id_penjual exists
            const penjual = await Penjual.findByPk(req.penjual.id_penjual);
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
                    response(500, { error: error.message }, "Error uploading image", res);
                });

                blobStream.on('finish', async () => {
                    foto_produk_url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                    const result = await Produk.update(
                        {
                            nama_produk,
                            desc_produk,
                            harga_produk,
                            stok_produk,
                            foto_produk: foto_produk_url,
                            id_penjual: req.penjual.id_penjual
                        },
                        { where: { id_produk: id_produk } }
                    );

                    if (result[0]) {
                        response(200, { isSuccess: result[0] }, "Successfully updated data", res);
                    } else {
                        response(404, "Produk not found", "error", res);
                    }
                });

                blobStream.end(foto_produk.buffer);
            } else {
                const result = await Produk.update(
                    {
                        nama_produk,
                        desc_produk,
                        harga_produk,
                        stok_produk,
                        foto_produk: foto_produk_url,
                        id_penjual: req.penjual.id_penjual
                    },
                    { where: { id_produk: id_produk } }
                );

                if (result[0]) {
                    response(200, { isSuccess: result[0] }, "Successfully updated data", res);
                } else {
                    response(404, "Produk not found", "error", res);
                }
            }
        } catch (error) {
            response(500, { error: error.message }, "error", res);
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
        response(500, { error: error.message }, "error", res);
    }
};
