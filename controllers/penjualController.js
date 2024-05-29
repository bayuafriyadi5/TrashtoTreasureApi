const { Penjual, Pembeli } = require('../models');
const response = require('../utils/response');

// Controller to handle registration as Penjual
exports.registerAsPenjual = async (req, res) => {
    try {
        const pembeli = req.pembeli; // Authenticated Pembeli from the token
        const { no_rekening } = req.body;

        // Check if the user is already a Penjual
        const existingPenjual = await Penjual.findOne({ where: { email: pembeli.email } });
        if (existingPenjual) {
            return response(400, null, "User is already registered as a Penjual", res);
        }

        // Create new Penjual
        const penjual = await Penjual.create({
            nama: pembeli.nama,
            email: pembeli.email,
            telepon: pembeli.telepon,
            no_rekening,
            token: pembeli.token
        });

        response(201, penjual, "Successfully registered as Penjual", res);
    } catch (error) {
        response(500, error, "Registration as Penjual error", res);
    }
};

exports.getAllPenjual = async (req, res) => {
    try {
        const result = await Penjual.findAll();
        response(200, result, "Get all data from Penjual", res);
    } catch (error) {
        response(500, error, "Error", res);
    }
};

exports.getPenjualById = async (req, res) => {
    try {
        const id_penjual = req.params.id_penjual;
        const result = await Penjual.findByPk(id_penjual);
        response(200, result, "Search Penjual by ID", res);
    } catch (error) {
        response(500, error, "Error", res);
    }
};

exports.findPenjualByName = async (req, res) => {
    try {
        const result = await Penjual.findOne({ where: { nama: req.query.nama } });
        response(200, result, "Search Penjual by name", res);
    } catch (error) {
        response(500, error, "Error", res);
    }
};

exports.createPenjual = async (req, res) => {
    try {
        const { nama, email, telepon, no_rekening } = req.body;
        const result = await Penjual.create({ nama, email, telepon, no_rekening });
        response(201, result, "Successfully insert data", res);
    } catch (error) {
        response(500, error, "Error", res);
    }
};

exports.updatePenjual = async (req, res) => {
    try {
        const penjual = req.penjual;
        const { nama, email, telepon, no_rekening } = req.body;
        const result = await Penjual.update(
            { no_rekening },
            { where: { id_penjual: penjual.id_penjual } }
        );
        if (result[0]) {
            response(200, { isSuccess: result[0] }, "Successfully updated data", res);
        } else {
            response(404, "User not found", "Error", res);
        }
    } catch (error) {
        response(500, error, "Error", res);
    }
};

exports.deletePenjual = async (req, res) => {
    try {
        const { id_penjual } = req.body;
        const result = await Penjual.destroy({ where: { id_penjual: id_penjual } });
        if (result) {
            response(200, { isDeleted: result }, "Successfully deleted data", res);
        } else {
            response(404, "User not found", "Error", res);
        }
    } catch (error) {
        response(500, error, "Error", res);
    }
};
