const { join } = require("path")
const mongoose = require("mongoose")

require("dotenv").config({ path: join(__dirname, "../", "/.env") })
const connection = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
mongoose.set("useFindAndModify", false)

module.exports = connection
