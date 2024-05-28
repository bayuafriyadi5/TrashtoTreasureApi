module.exports = (sequelize, DataTypes) => {
    const TransaksiProduk = sequelize.define('TransaksiProduk', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_produk: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_transaksi: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nama_produk: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        harga_produk: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        total_harga: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'transaksi_produk',
        timestamps: true, // Enable timestamps
        createdAt: 'created_at', // Map createdAt to created_at
        updatedAt: 'updated_at', // Map updatedAt to updated_at
    });

    TransaksiProduk.associate = models => {
        TransaksiProduk.belongsTo(models.Produk, { foreignKey: 'id_produk', as: 'produk' });
        TransaksiProduk.belongsTo(models.Transaksi, { foreignKey: 'id_transaksi', as: 'transaksi' });
    };

    return TransaksiProduk;
};
