module.exports = (sequelize, DataTypes) => {
    const Pembeli = sequelize.define('Pembeli', {
        id_pembeli: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telepon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alamat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'pembeli',
        timestamps: false,
    });

    return Pembeli;
};
