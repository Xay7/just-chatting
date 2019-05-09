const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const LocalStrategy = require("passport-local").Strategy;
const { JWT_S } = require("./config/index");
const User = require("./models/user");

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

passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

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
