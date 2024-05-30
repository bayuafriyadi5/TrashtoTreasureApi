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
            unique: true, // Ensure email is unique
            validate: {
                isEmail: true, // Validate email format
            },
        },
        telepon: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        alamat: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photo_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    }, {
        tableName: 'pembeli',
        timestamps: false,
    });

    return Pembeli;
};
