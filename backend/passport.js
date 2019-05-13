const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const { JWT_S, oauth } = require("./config/index");
const User = require("./models/user");
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const FacebookTokenStrategy = require('passport-facebook-token');

// JSON Web tokens strategy
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: JWT_S
},
  async (payload, done) => {
    try {

      const user = await User.findById(payload.sub);
      if (!user) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
)
);

// Local strategy

passport.use(new LocalStrategy({
  usernameField: "email"
},
  async (email, password, done) => {
    try {
      const user = await User.findOne({ "local.email": email });

      if (!user) {
        return done(null, false);
      }

      const isValid = await user.isValidPassword(password);

      if (!isValid) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
)
);

// Google OAUTH strategy

passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: oauth.google.clientID,
  clientSecret: oauth.google.clientSecret,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ "google.id": profile.id });
    if (existingUser) {
      console.log("User arleady exists");
      return done(null, existingUser);
    }

    console.log("User doesn't exists");

    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();
    done(null, newUser);
  }
  catch (error) {
    done(error, false, error.message);
  }
}));

passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: oauth.facebook.clientID,
  clientSecret: oauth.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ "facebook.id": profile.id });

    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
      method: 'facebook',
      facebook: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })
    await newUser.save();

    done(null, newUser);

  } catch (error) {
    done(error, false, error.message);
  }
}));
