process.on("unhandledRejection", (reason, promise) => {
    console.error("Error occured")
    console.log("Reason: ", reason)
    console.log("Promise: ", promise)
})

require("./database.js")
require("./www.js")
