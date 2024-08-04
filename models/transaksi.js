module.exports = (sequelize, DataTypes) => {
    const Transaksi = sequelize.define('Transaksi', {
        id_transaksi: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'unpaid',
        },
        id_pembeli: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_harga: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_penjual: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        invoice_id: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'xxx',

        },
        invoice_url: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: 'xxx',

        },
        id_produk: {
            type: DataTypes.INTEGER,
            allowNull: false,

        },
        alamat: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status_pesanan: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'transaksi',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    Transaksi.associate = models => {
        Transaksi.belongsTo(models.Penjual, { foreignKey: 'id_penjual', as: 'penjual' });
        Transaksi.belongsTo(models.Pembeli, { foreignKey: 'id_pembeli', as: 'pembeli' });
        Transaksi.belongsTo(models.Produk, { foreignKey: 'id_produk', as: 'produk' });
    };

    return Transaksi;
};
