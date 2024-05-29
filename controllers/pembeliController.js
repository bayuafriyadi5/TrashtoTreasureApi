const { Pembeli, Penjual } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');

exports.registerPembeli = async (req, res) => {
    try {
        const { nama, email, telepon, alamat, password } = req.body;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new Pembeli
        const result = await Pembeli.create({
            nama,
            email,
            telepon,
            alamat,
            password: hashedPassword
        });

        response(201, result, "Successfully registered", res);
    } catch (error) {
        response(500, error, "Registration error", res);
    }
};

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
        const id_pembeli = req.params.id_pembeli;
        const result = await Pembeli.findByPk(id_pembeli);
        response(200, result, "search pembeli id", res);
    } catch (error) {
        response(500, error, "error", res);
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

exports.createPembeli = async (req, res) => {
    try {
        const { nama, email, telepon, alamat } = req.body;
        const result = await Pembeli.create({ nama, email, telepon, alamat });
        response(200, result, "Successfully insert data", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.updatePembeli = async (req, res) => {
    try {
        const { id_pembeli, nama, email, telepon, alamat } = req.body;
        const result = await Pembeli.update({ nama, email, telepon, alamat }, { where: { id_pembeli: id_pembeli } });
        if (result[0]) {
            response(200, { isSuccess: result[0] }, "Successfully update data", res);
        } else {
            response(404, "user not found", "error", res);
        }
    } catch (error) {
        response(500, error, "error", res);
    }
};

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
