const jwt = require('jsonwebtoken');
const { Pembeli, Penjual } = require('../models');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const pembeli = await Pembeli.findByPk(decoded.id_pembeli);
        if (!pembeli || pembeli.token !== token) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.pembeli = pembeli;
        next();

        const penjual = await Penjual.findByPk(decoded.id_penjual);
        if (!penjual || penjual.token !== token) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.penjual = penjual;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateToken;
