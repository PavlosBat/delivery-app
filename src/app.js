const express = require('express')
require('./db/mongoose')
const merchantRouter = require('./routers/merchant')
const adminRouter = require('./routers/admin')
const orderRouter = require('./routers/order')

//Initialize Express API????
const app = express()

//Customize server to be able to parse JSON (that we provide in the body of request) to Object 
app.use(express.json())

//Customize routes from different Endpoints for simplicity
app.use(adminRouter)
app.use(merchantRouter)
app.use(orderRouter)

module.exports = app
