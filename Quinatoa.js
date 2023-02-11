const express = require("express")
const cors = require("cors")
const app = express()
const dbConnectnoSql = require("./Conexiones/noSql")
const dbConnectSql = require("./Conexiones/slq")

app.use(cors())
app.use(express.json())
app.use(cors({ origin: true, credentials: true  }));
// app.use(express.static("storage"))

// app.use("/api", require("./routes"))

app.use(require('./routes/auth'));
app.use(require('./routes/residente'));
app.use(require('./routes/index'));
app.use(require('./routes/rolResidente'));
app.use(require('./routes/usuario_externo'));

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Tu server esta listo por el puerto ${port}`)
})

