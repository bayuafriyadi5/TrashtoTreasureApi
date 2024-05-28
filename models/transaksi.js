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
            defaultValue: 'unpaid', // Set default value
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
        },
        invoice_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'transaksi',
        timestamps: true, // Enable timestamps
        createdAt: 'created_at', // Map createdAt to created_at
        updatedAt: 'updated_at', // Map updatedAt to updated_at
    });

    Transaksi.associate = models => {
        Transaksi.belongsTo(models.Penjual, { foreignKey: 'id_penjual', as: 'penjual' });
        Transaksi.belongsTo(models.Pembeli, { foreignKey: 'id_pembeli', as: 'pembeli' });
    };

    return Transaksi;
};
