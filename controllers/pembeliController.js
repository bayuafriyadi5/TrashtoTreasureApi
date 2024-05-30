const { Pembeli, Penjual } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const bucket = require('../config/firebaseConfig');
const response = require('../utils/response');


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

exports.registerPembeli = [
    upload.single('photo_url'),
    async (req, res) => {
        try {
            const { nama, email, telepon, password, alamat } = req.body;
            const photo = req.file;

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            let photo_url = null;
            if (photo) {
                const blob = bucket.file(Date.now() + path.extname(photo.originalname));
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: photo.mimetype
                    }
                });

                blobStream.on('error', error => {
                    throw new Error('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', async () => {
                    // Get the download token
                    const [metadata] = await blob.getMetadata();
                    const downloadToken = metadata.metadata.firebaseStorageDownloadTokens;

                    // Construct the photo URL with the download token
                    photo_url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(blob.name)}?alt=media&token=${downloadToken}`;

                    const result = await Pembeli.create({
                        nama,
                        email,
                        telepon,
                        password: hashedPassword,
                        alamat,
                        photo_url // Save the photo URL with the download token
                    });

                    response(201, result, "Successfully registered", res);
                });

                blobStream.end(photo.buffer);
            } else {
                const result = await Pembeli.create({
                    nama,
                    email,
                    telepon,
                    password: hashedPassword
                });

                response(201, result, "Successfully registered", res);
            }
        } catch (error) {
            response(500, error, "Registration error", res);
        }
    }
];


exports.loginPembeli = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find Pembeli by email
        const pembeli = await Pembeli.findOne({ where: { email } });
        if (!pembeli) {
            return response(404, null, "User not found", res);
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, pembeli.password);
        if (!isPasswordValid) {
            return response(401, null, "Invalid credentials", res);
        }

        // Generate JWT token
        const token = jwt.sign({ id_pembeli: pembeli.id_pembeli }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update user token in the database
        pembeli.token = token;

        await pembeli.save();


        const penjual = await Penjual.findOne({ where: { email } });
        if (penjual) {
            penjual.token = token;
            await penjual.save();
        }


        response(200, { token }, "Login successful", res);
    } catch (error) {
        response(500, error, "Login error", res);
    }
};


exports.getAllPembeli = async (req, res) => {
    try {
        const result = await Pembeli.findAll();
        response(200, result, "get all data from pembeli", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.getPembeliById = async (req, res) => {
    try {
        const pembeli = req.pembeli;
        if (!pembeli) {
            return response(401, null, "Unauthorized: No authenticated user", res);
        }

        const result = await Pembeli.findByPk(pembeli.id_pembeli);
        response(200, result, "Retrieved pembeli data based on auth token", res);
    } catch (error) {
        response(500, error, "Error retrieving pembeli data", res);
    }
};


exports.findPembeliByName = async (req, res) => {
    try {
        const result = await Pembeli.findOne({ where: { nama: req.query.nama } });
        response(200, result, "search penjual name", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};


exports.updatePembeli = [
    upload.single('photo_url'),
    async (req, res) => {
        try {
            const pembeli = req.pembeli;
            const { nama, email, telepon, alamat, password } = req.body;
            const photo = req.file;

            // Hash the password if provided
            let hashedPassword;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }

            let photo_url = pembeli.photo_url; // Use existing photo URL if not updated
            if (photo) {
                const blob = bucket.file(Date.now() + path.extname(photo.originalname));
                const blobStream = blob.createWriteStream({
                    metadata: {
                        contentType: photo.mimetype
                    }
                });

                blobStream.on('error', error => {
                    throw new Error('Something is wrong! Unable to upload at the moment.');
                });

                blobStream.on('finish', async () => {
                    photo_url = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;

                    const result = await Pembeli.update({
                        nama,
                        email,
                        telepon,
                        alamat,
                        password: hashedPassword,
                        photo_url
                    }, { where: { id_pembeli: pembeli.id_pembeli } });

                    if (result[0]) {
                        response(200, { isSuccess: result[0] }, "Successfully updated data", res);
                    } else {
                        response(404, "User not found", "error", res);
                    }
                });

                blobStream.end(photo.buffer);
            } else {
                const result = await Pembeli.update({
                    nama,
                    email,
                    telepon,
                    alamat,
                    password: hashedPassword
                }, { where: { id_pembeli: pembeli.id_pembeli } });

                if (result[0]) {
                    response(200, { isSuccess: result[0] }, "Successfully updated data", res);
                } else {
                    response(404, "User not found", "error", res);
                }
            }
        } catch (error) {
            response(500, error, "Error updating data", res);
        }
    }
];


exports.deletePembeli = async (req, res) => {
    try {
        const { id_pembeli } = req.body;
        const result = await Pembeli.destroy({ where: { id_pembeli: id_pembeli } });
        if (result) {
            response(200, { isDeleted: result }, "Successfully delete data", res);
        } else {
            response(404, "user not found", "error", res);
        }
    } catch (error) {
        response(500, error, "error", res);
    }
};
