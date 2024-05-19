const { Pembeli } = require('../models');
const response = require('../utils/response');

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
