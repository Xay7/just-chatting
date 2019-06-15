const socket = require('../socket');
const express = require('express');
const router = require('express-promise-router')();
const passport = require('passport');
const passportConfig = require('../passport');
const { validateBody, schemas } = require('../helpers/route-helpers');
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', { session: false })
const passportJWT = passport.authenticate('jwt', { session: false })
const ChatroomController = require('../controllers/chatrooms');
const passportGoogle = passport.authenticate('googleToken', { session: false })
const passportFacebook = passport.authenticate('facebookToken', { session: false });

// Auth stuff
router.route('/signup')
    .post(validateBody(schemas.signUpSchema), UsersController.signUp);

router.route('/signin')
    .post(passportSignIn, UsersController.signIn);

router.route('/oauth/google')
    .post(passportGoogle, UsersController.googleOAuth)

router.route('/oauth/facebook')
    .post(passportFacebook, UsersController.facebookOAuth);

router.route('/:username/avatar')
    .put(passportJWT, UsersController.changeAvatar);

router.route('/:username/password')
    .put(
        validateBody(schemas.changePassword),
        passportJWT,
        UsersController.changePassword
    )

// Get user chatrooms
router.route('/:username/chatrooms')
    .get(passportJWT, ChatroomController.chatrooms)

module.exports = router;