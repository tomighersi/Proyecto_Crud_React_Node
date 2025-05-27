const express = require('express')
const app = express()
const cors = require('cors');
const port = 3001

app.use(express.json())

app.use(cors()); // permite todas las conexiones

const userRouter = require('./routes/usuario.routes')
app.use('/usuarios', userRouter)

const productRouter = require('./routes/product.routes')
app.use('/productos', productRouter)

app.listen(port, () => {
    console.log(`Servidor corriendo en ${port}`)
})