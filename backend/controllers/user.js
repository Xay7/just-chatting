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

        if (password.length < 6) {
            res.json({ failure: "Incorrect data" })
        }

        const user = await User.findOne({ id: req.user.id })

        user.password = password
        await user.save({ fields: ["password"] })

        res.json({ success: "Password has been changed" })
    }

    const changeAvatar = async (req, res, next) => {
        const id = req.params.id

        await User.findOneAndUpdate(
            { _id: id },
            {
                avatar: `https://justchattingbucket.s3.eu-west-3.amazonaws.com/${id}`,
            }
        )

        await uploadAvatar(req, res, function (err) {
            if (err) {
                return res.status(403).json({ error: err.message })
            }

            res.status(201).json({ success: "Updated avatar" })
        })
    }

    const logout = async (req, res, next) => {
        req.logout()
        // res.redirect("/")
        // req.session.destroy()
        res.json({ success: "Logout successful" })
    }

    const googleOAuth = async (req, res, next) => {
        const token = signToken(req.user)
        res.json({ token })
    }

    const facebookOAuth = async (req, res, next) => {
        const token = signToken(req.user)
        console.log(sequelize)
        res.json({ token })
    }

    //dodane ale po co
    const getInfo = async (req, res, next) => {
        if (req.params.id) {
            const user = await User.findOne({ where: { id: req.params.id } })
            res.json(user)
        }
        res.json({ status: false })
    }

    return {
        signUp,
        signIn,
        changePassword,
        changeAvatar,
        logout,
        googleOAuth,
        facebookOAuth,
        getInfo,
    }
}
