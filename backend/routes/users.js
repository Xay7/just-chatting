const socket = require("../bin/socket")
const express = require("express")
const router = require("express-promise-router")()
const passport = require("passport")
const passportConfig = require("../passport")
const { validateBody, schemas } = require("../helpers/route-helpers")
const UsersController = require("../controllers/users")
const passportSignIn = passport.authenticate("local", { session: false })
const passportJWT = passport.authenticate("jwt", { session: false })
const ChatroomController = require("../controllers/chatrooms")

// Auth stuff
router
    .route("/signup")
    .post(validateBody(schemas.signUpSchema), UsersController.signUp)

router.route("/signin").post(passportSignIn, UsersController.signIn)

router.route("/logout").post(passportJWT, UsersController.logout)

router.route("/:id/avatar").put(passportJWT, UsersController.changeAvatar)

router
    .route("/:id/password")
    .put(
        validateBody(schemas.changePassword),
        passportJWT,
        UsersController.changePassword
    )

// Get user chatrooms
router.route("/:id/chatrooms").get(passportJWT, ChatroomController.chatrooms)

module.exports = router
