const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/auth');

router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.pembeli });
});

module.exports = router;
