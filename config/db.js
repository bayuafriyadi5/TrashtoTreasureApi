const { Sequelize } = require('sequelize');
const config = require('./config.json')['development'];


const sequelize = new Sequelize({
    "username": "uyjhigauptnee1jk",
    "password": "KdcwlywLFEukDTa5V2DN",
    "database": "begnhhimrzdbwryxnjrr",
    "host": "begnhhimrzdbwryxnjrr-mysql.services.clever-cloud.com",
    "dialect": "mysql",
    "dialectModule": require("mysql2"),
    "benchmark": true
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;
