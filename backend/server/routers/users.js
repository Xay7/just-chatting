const { join } = require("path")
const express = require("express")
const router = express.Router()
const { validateBody, schemas } = require("../../helpers/route-helpers")

const isLoggedIn = require("../../utils/isLoggedIn")
const isLoggedOut = require("../../utils/isLoggedOut")

module.exports = (passport, sequelize) => {
    const chatroomCtrlPath = join(__dirname, "../../controllers/chatroom")
    const ChatroomController = require(chatroomCtrlPath)(sequelize)

    const userCtrlPath = join(__dirname, "../../controllers/user")
    const UserController = require(userCtrlPath)(passport, sequelize)

    router.post(
        "/signup",
        validateBody(schemas.signUpSchema),
        UserController.signUp
    )

    router.get("/:id", isLoggedIn, UserController.getInfo)

    router.post("/signin", isLoggedOut, UserController.signIn)

    router.post("/logout", UserController.logout)

    router.put("/:id/avatar", isLoggedIn, UserController.changeAvatar)

    router.put(
        "/:id/password",
        validateBody(schemas.changePassword),
        UserController.changePassword
    )

    router.get("/:id/chatrooms", ChatroomController.chatrooms)

    router.post("/logowanie", isLoggedOut, async (req, res, next) => {
        passport.authenticate("local-login", (err, user, info) => {
            if (err) {
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
    })

    return router
}
