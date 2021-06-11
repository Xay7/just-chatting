const { join } = require("path")
const JWT = require("jsonwebtoken")
const { JWT_S } = require("../config/index")
const upload = require("../services/fileupload")
const uploadAvatar = upload.single("avatar")
const { Op } = require("sequelize")
const bcryptjs = require("bcryptjs")

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
                    console.log("1:", err)
                } else {
                    if (!user) {
                        console.log("no user found")
                    } else {
                        req.login(user, (err) => {
                            if (err) {
                                console.log("2::", err)
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

        // const token = signToken(req.user)
        // res.cookie("access_token", token, {
        //     httpOnly: true,
        //     expires: new Date(Date.now() + 900000),
        //     sameSite: "none",
        //     secure: true,
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

    //dodane ale po co
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
