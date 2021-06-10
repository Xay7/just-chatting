const { join } = require("path")
const JWT = require("jsonwebtoken")
const { JWT_S } = require("../config/index")
const upload = require("../services/fileupload")
const uploadAvatar = upload.single("avatar")
const { Op } = require("sequelize")

module.exports = (passport, sequelize) => {
    const { User } = sequelize.models

    const signToken = (user) => {
        return (token = JWT.sign(
            {
                iss: "HELLO",
                sub: user.id,
                iat: new Date().getTime(), // CURRENT TIME
                exp: new Date().setDate(new Date().getDate() + 1), // TOMMOROW
            },
            JWT_S
        ))
    }

    const signUp = async (req, res, next) => {
        const { email, password, name } = req.value.body

        const foundUser = await User.findOne({ where: { email } })
        const foundName = await User.findOne({ where: { name } })

        if (foundUser) {
            return res.status(403).send({ error: "Email arleady in use" })
        }

        if (foundName) {
            return res.status(403).send({ error: "Username arleady in use" })
        }

        await User.create({
            email: email,
            password: password,
            name: name,
            avatar: "https://justchattingbucket.s3.eu-west-3.amazonaws.com/DefaultUserAvatar",
        })

        // const token = signToken(newUser)

        // res.cookie("access_token", token, {
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 900000),
        //     sameSite: "none",
        //     secure: true,
        // })

        res.json({ success: "User has been registered" })
    }

    const signIn = async (req, res, next) => {
        console.log("trying")

        if (!req.body.email || !req.body.password) {
            res.status(400).json({ error: "data incomplete" })
        } else {
            passport.authenticate("local-login", (err, user, info) => {
                if (err) {
                    console.log(err)
                } else {
                    if (!user) {
                    } else {
                        req.login(user, (err) => {
                            if (err) {
                            } else {
                                if (
                                    !req.query.next ||
                                    req.query.next.includes("http")
                                ) {
                                    res.redirect("/")
                                } else {
                                    res.redirect(req.query.next)
                                }
                            }
                        })
                    }
                }
            })(req, res)
        }

        // if (req.body)
        //     if (req.session.user) {
        //         return res
        //             .status(400)
        //             .json({ error: "User arleady logged in, try again later" })
        //     }

        // const avatar = req.user.avatar
        // const username = req.user.name
        // const id = req.user._id

        // const token = signToken(req.user)
        // res.cookie("access_token", token, {
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 900000),
        //     sameSite: "none",
        //     secure: true,
        // })

        // req.session.user = req.user

        res.send("Logged")

        // res.json({
        //     username,
        //     avatar,
        //     id,
        // })
    }

    const changePassword = async (req, res, next) => {
        const password = req.body.password
        await User.findOne({ _id: req.params.id }, function (err, doc) {
            doc.password = password
            doc.save()
        })

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

    const getInfo = async (req, res, next) => {
        if (req.params.id) {
            const user = await User.findOne({ where: { id: req.params.id } })
            res.json(user)
        }
        res.json({ status: false })
    }

    return {
        signToken,
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
