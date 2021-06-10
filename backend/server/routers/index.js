const express = require("express")
const { join } = require("path")

module.exports = (passport, sequelize, DataTypes) => {
    const MainRouter = express.Router()

    // const passport = require(join(__dirname, "../../controllers/passport"))(
    //     sequelize,
    //     DataTypes
    // )

    const { User, Channel, Chatroom, ChannelMessage } = sequelize.models

    //router.use('/public', express.static(join(__dirname, '../../public/')))

    MainRouter.get("/sync", async (_, res) => {
        await sequelize.models.User.sync({
            force: true,
        })

        await sequelize.models.Channel.sync({
            force: true,
        })

        await sequelize.models.Chatroom.sync({
            force: true,
        })

        await sequelize.models.ChannelMessage.sync({
            force: true,
        })

        res.send("OK")
    })

    MainRouter.get("/make", async (_, res) => {
        if (!(await User.findOne({ username: "admin" }))) {
            await User.create({
                name: "admin",
                email: "admin@admin.admin",
                password: await User.hashPassword("admin"),
                avatar: "https://justchattingbucket.s3.eu-west-3.amazonaws.com/DefaultUserAvatar",
            })
        }

        res.send("OK")
    })

    MainRouter.get("/users/get", async (_, res) => {
        const users = await User.findAll()
        console.log(users)
        if (users) {
            res.json(users)
        } else {
            res.send("No one user found.")
        }
    })

    MainRouter.get("/users/getOne", async (_, res) => {
        const users = await User.findOne({ email: "admin@admin.admin" })
        console.log(users)
        if (users) {
            res.json(users)
        } else {
            res.send("No one user found.")
        }
    })

    MainRouter.get("/loguj", async (req, res, next) => {
        const user = await User.findOne({
            where: { email: "admin@admin.admin" },
        })

        if (user) {
            req.logIn(user, (err) => {
                if (err) {
                    return next(err)
                }
                return res.redirect("/users/" + req.user.id)
            })
        }
        res.json(user)
    })

    MainRouter.get("/", async (req, res) => {
        if (req.user) res.json(req.user)
        res.send("OK")
    })

    MainRouter.get("/index.php", async (req, res) => res.redirect("/"))
    MainRouter.get("/index.html", async (req, res) => res.redirect("/"))

    MainRouter.use("/users", require("./users")(passport, sequelize))

    MainRouter.use("/chatrooms", require("./chatrooms")(sequelize))

    MainRouter.use("/channels", require("./channels")(sequelize))

    // MainRouter.use(
    //     "/favicon.ico",
    //     express.static(join(__dirname, "../../assets/favicon.png"))
    // )

    // MainRouter.use(
    //     "/robots.txt",
    //     express.static(join(__dirname, "../../assets/robots.txt"))
    // )

    // MainRouter.use(
    //     "/sitemap.xml",
    //     express.static(join(__dirname, "../../assets/sitemap.xml"))
    // )

    MainRouter.get("*", async (req, res) => res.redirect("/"))

    return MainRouter
}
