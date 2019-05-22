const socket = require('../socket');
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas } = require('../helpers/route-helpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })
const passportGoogle = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false });

router.route('/signup')
    .post(
        validateBody(schemas.signUpSchema),
        UsersController.signUp,

    )

router.route('/signin')
    .post(
        validateBody(schemas.signInSchema),
        passportSignIn,
        UsersController.signIn,
    )



router.route('/chat')
    .get(passportJWT, UsersController.chat)

router.route('/newchat')
    .post(UsersController.newChat)

router.route('/deletechat')
    .delete(UsersController.deleteChat)

router.route('/joinchat')
    .get(UsersController.joinChat)



router.route('/oauth/google')
    .post(passportGoogle, UsersController.googleOAuth)

router.route('/oauth/facebook')
    .post(passportFacebook, UsersController.facebookOAuth);



module.exports = router;