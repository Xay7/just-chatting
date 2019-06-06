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

router.route('/:username/avatar')
    .put(passportJWT, UsersController.changeAvatar)

router.route('/:username/password')
    .put(
        validateBody(schemas.changePassword),
        passportJWT,
        UsersController.changePassword)


router.route('/signin')
    .post(
        validateBody(schemas.signInSchema),
        passportSignIn,
        UsersController.signIn,
    )

router.route('/:username/chat')
    .get(passportJWT, UsersController.chat)
    .post(passportJWT, UsersController.newChat)


router.route('/:username/chat/:id')
    .delete(passportJWT, UsersController.deleteChat)
    .put(passportJWT, UsersController.joinChat)

router.route('/:username/chat/:id/channels')
    .put(passportJWT, UsersController.newChannel)
    .get(passportJWT, UsersController.getChannels);

router.route('/:username/chat/:id/channels/:channelID')
    .put(passportJWT, UsersController.changeChannelData);

router.route('/:username/chat/:id/channels/:channelID/messages')
    .put(passportJWT, UsersController.storeMessage)
    .get(passportJWT, UsersController.getMessages)


// Add support lateeeeeeeeeeer

router.route('/oauth/google')
    .post(passportGoogle, UsersController.googleOAuth)

router.route('/oauth/facebook')
    .post(passportFacebook, UsersController.facebookOAuth);



module.exports = router;