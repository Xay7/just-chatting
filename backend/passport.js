const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const { JWT_S } = require("./config/index");
const User = require("./models/user");

const getCookie = req => {

  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token
}

// JSON Web tokens strategy
passport.use(new JWTStrategy({
  jwtFromRequest: getCookie,
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

      const user = await User.findOne({ "email": email });

      if (!user) {
        return done(null, false);
      }

      const isValid = await user.isValidPassword(password);

      if (!isValid) {
        return done(null, false);
      }

      done(null, user);
    } catch (error) {
      console.log(error);
      done(error, false);
    }
  }
)
);