const { join } = require("path")
const upload = require("../services/fileupload")
const uploadAvatar = upload.single("avatar")
const { Op } = require("sequelize")
const bcryptjs = require("bcryptjs")

module.exports = (passport, sequelize) => {
    const { User } = sequelize.models

    const signUp = async (req, res, next) => {
        const email = !req.body.email ? "" : req.body.email.trim()
        const password = !req.body.password ? "" : req.body.password.trim()
        const name = !req.body.name ? "" : req.body.name.trim()

        const foundUser = await User.findOne({ where: { email } })

        if (foundUser) {
            return res.status(403).send({ error: "Email arleady in use" })
        }

        const foundName = await User.findOne({ where: { name } })

        if (foundName) {
            return res.status(403).send({ error: "Username arleady in use" })
        }

        const pwdHash = await bcryptjs.hash(password, bcryptjs.genSaltSync(10))

        await User.create({
            email: email,
            password: pwdHash,
            name: name,
            avatar: "https://justchattingbucket.s3.eu-west-3.amazonaws.com/DefaultUserAvatar",
        })

        res.json({ success: "User has been registered" })
    }

    const signIn = async (req, res, next) => {
        req.session.user = req.user
        if (req.body)
            if (req.user) {
                return res
                    .status(400)
                    .json({ error: "User arleady logged in, try again later" })
            }

        if (!req.body.email || !req.body.password) {
            res.status(400).json({ error: "data incomplete" })
        } else {
            console.log("authenticating")
            passport.authenticate("local-login", (err, user, info) => {
                if (err) {
                } else {
                    if (!user) {
                        res.status(404).json({ failure: "data incorrect" })
                    } else {
                        req.login(user, (err) => {
                            if (err) {
                            } else {
                                // res.redirect("/users/" + user.id)
                                const avatar = user.avatar
                                const username = user.name
                                const id = user.id

                                res.json({
                                    avatar,
                                    username,
                                    id,
                                })

                                // if (
                                //     !req.query.next ||
                                //     req.query.next.includes("http")
                                // ) {
                                //     res.redirect("/")
                                // } else {
                                //     res.redirect(req.query.next)
                                // }
                            }
                        })
                    }
                }
            })(req, res)
        }
    }

    const changePassword = async (req, res, next) => {
        const password = !req.body.password ? "" : req.body.password
        const userId = req.user.id

        if (password.length < 6) {
            res.json({ failure: "Incorrect data" })
        }

        const user = await User.findOne({ where: { id: userId } })
        user.password = password
        await user.save({ fields: ["password"] })

        res.json({ success: "Password has been changed" })
    }

    const changeAvatar = async (req, res, next) => {
        const avatarId = req.params.id
        const userId = req.user.id

        await User.findOneAndUpdate({ where: { id: userId } })

        user.avatar = `https://justchattingbucket.s3.eu-west-3.amazonaws.com/${avatarId}`
        user.save({ fields: ["avatar"] })

        await uploadAvatar(req, res, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message })
            }

            res.status(201).json({ success: "Updated avatar" })
        })
    }

    const logout = async (req, res, next) => {
        req.logout()
        res.json({ success: "Logout successful" })
    }

    const googleOAuth = async (req, res, next) => {
        res.status(500).json("Not implemented yet.")
    }

    const facebookOAuth = async (req, res, next) => {
        res.status(500).json("Not implemented yet.")
    }

    return {
        signUp,
        signIn,
        changePassword,
        changeAvatar,
        logout,
        googleOAuth,
        facebookOAuth,
    }
}
