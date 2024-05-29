module.exports = (sequelize, DataTypes) => {
    const Penjual = sequelize.define('Penjual', {
        id_penjual: {
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
        no_rekening: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'penjual',
        timestamps: false,
    });

    Penjual.associate = models => {
        Penjual.hasMany(models.Produk, {
            foreignKey: 'id_penjual',
            as: 'produk'  // Optional, if you want to define the inverse association
        });
    };


    return Penjual;
};
