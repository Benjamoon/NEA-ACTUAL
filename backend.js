import express from "express" // Import express
const app = express() // initailise a new express app

//Api router
import apiRouter from "./backend-api/_.js"
app.use("/api", apiRouter)

app.use(express.static("./public")) //If we arent on the above routes, serve the front end
app.listen(8081) //Listen on port 8080