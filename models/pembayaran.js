module.exports = (sequelize, DataTypes) => {
    const Pembayaran = sequelize.define('Pembayaran', {
        id_pembayaran: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        waktu_pemabayaran: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_bayar: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        metode_pembayaran: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_transaksi: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'pembayaran',
        timestamps: false,
    });

    Pembayaran.associate = models => {
        Pembayaran.belongsTo(models.Transaksi, { foreignKey: 'id_transaksi', as: 'transaksi' });
    };

    return Pembayaran;
};
