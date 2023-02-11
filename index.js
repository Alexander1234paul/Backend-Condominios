//PACKAGES
const express = require("express")
const cors = require("cors")
const app = express()
const dbConnectnoSql = require("./Conexiones/noSql")
require("./Conexiones/slq")

//MIDDLEWARES
app.use(cors())
app.use(express.json())
    // app.use(express.static("storage"))
    // app.use("/api", require("./routes"))


//CONTROLLER
// const index_controller = require('./controllers/alquiler')

//ROUTES
app.use(require('./routes/index'));

//EJECUTION

const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`Tu server esta listo por el puerto ${port}`)
})