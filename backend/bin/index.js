process.on("unhandledRejection", (reason, promise) => {
    console.error("Error occured")
    console.log("Reason: ", reason)
    console.log("Promise: ", promise)
})

require("./www.js")
