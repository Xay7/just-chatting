module.exports = (sequelize, DataTypes) => {
    const Chatroom = sequelize.define("Chatroom", {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
            autoIncrementation: true,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })
    return Chatroom
}
