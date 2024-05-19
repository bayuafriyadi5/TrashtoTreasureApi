const { Penjual } = require('../models');
const response = require('../utils/response');

exports.getAllPenjual = async (req, res) => {
    try {
        const result = await Penjual.findAll();
        response(200, result, "get all data from penjual", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.getPenjualById = async (req, res) => {
    try {
        const id_penjual = req.params.id_penjual;
        const result = await Penjual.findByPk(id_penjual);
        response(200, result, "search penjual id", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.findPenjualByName = async (req, res) => {
    try {
        const result = await Penjual.findOne({ where: { nama: req.query.nama } });
        response(200, result, "search penjual name", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.createPenjual = async (req, res) => {
    try {
        const { nama, email, telepon } = req.body;
        const result = await Penjual.create({ nama, email, telepon });
        response(200, result, "Successfully insert data", res);
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.updatePenjual = async (req, res) => {
    try {
        const { id_penjual, nama, email, telepon } = req.body;
        const result = await Penjual.update({ nama, email, telepon }, { where: { id_penjual: id_penjual } });
        if (result[0]) {
            response(200, { isSuccess: result[0] }, "Successfully update data", res);
        } else {
            response(404, "user not found", "error", res);
        }
    } catch (error) {
        response(500, error, "error", res);
    }
};

exports.deletePenjual = async (req, res) => {
    try {
        const { id_penjual } = req.body;
        const result = await Penjual.destroy({ where: { id_penjual: id_penjual } });
        if (result) {
            response(200, { isDeleted: result }, "Successfully delete data", res);
        } else {
            response(404, "user not found", "error", res);
        }
    } catch (error) {
        response(500, error, "error", res);
    }
};
