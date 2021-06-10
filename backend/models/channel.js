module.exports = (sequelize, DataTypes) => {
    const Channel = sequelize.define("Channel", {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrementation: true,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    })

    return Channel
}
