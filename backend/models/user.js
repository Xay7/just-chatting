const bcrypt = require("bcryptjs")

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            id: {
                type: DataTypes.INTEGER,
                unique: true,
                primaryKey: true,
                allowNull: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                lowercase: true,
            },
            email: {
                type: DataTypes.STRING,
                lowercase: true,
                isEmail: true,
                unique: true,
                required: true,
            },
            password: {
                type: DataTypes.STRING,
                required: true,
            },
            avatar: {
                type: DataTypes.STRING,
            },
        }
        // { indexes: [{ unique: true, fields: ["email"] }] }
    )

    User.hashPassword = async (password) => {
        const hash = await bcrypt.hash(password, await bcrypt.genSalt(10))
        console.log("hash = ", hash)
        console.log("hash = ", typeof hash)
        return hash
    }

    User.isValidPassword = async (newPassword) => {
        try {
            return await bcrypt.compare(newPassword, this.password)
        } catch (error) {
            throw new Error(error)
        }
    }

    return User
}
