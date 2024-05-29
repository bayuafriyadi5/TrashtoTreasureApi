const jwt = require('jsonwebtoken');
const { Pembeli } = require('../models');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const pembeli = await Pembeli.findByPk(decoded.id_pembeli);
        if (!pembeli) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (pembeli.token !== token) {
            return res.status(401).json({ message: 'Token mismatch, authorization denied.' });
        }

        req.pembeli = pembel
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token is invalid.' });
    }
};

module.exports = authenticateToken;
