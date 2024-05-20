module.exports = (sequelize, DataTypes) => {
    const Produk = sequelize.define('Produk', {
        id_produk: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_produk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        desc_produk: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        harga_produk: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stok_produk: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        foto_produk: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_penjual: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        tableName: 'produk',
        timestamps: false,
    });

    Produk.associate = models => {
        Produk.belongsTo(models.Penjual, {
            foreignKey: 'id_penjual',
            as: 'penjual'
        });
    };


    return Produk;
};
