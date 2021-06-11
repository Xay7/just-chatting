const { join } = require("path")

const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")

module.exports = (passport, sequelize) => {
    const { User } = sequelize.models

    passport.serializeUser((user, done) => done(null, user.id))

    passport.deserializeUser((id, done) =>
        User.findOne({ where: { id } }).then((user) => done(null, user))
    )

    passport.use(
        "local-login",
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password",
                passReqToCallback: true,
            },
            (req, email, password, done) => {
                User.findOne({ where: { email } }).then((user) => {
                    if (!user) return done(null, false)

                    //console.log("user: ", user)

                    const comparison = bcrypt.compareSync(
                        password,
                        user.password
                    )
                    console.log("bcrypt compare() => ", comparison)
                    if (!bcrypt.compareSync(password, user.password))
                        return done(null, false)

                    console.log("last step")
                    return done(null, user)
                })
            }
        )
    )
    return passport
}
