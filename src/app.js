const express = require('express')
// const hbs = require('hbs')
const path = require('path')
require('./db/mongoose')
const merchantRouter = require('./routers/merchant')
const adminRouter = require('./routers/admin')
const orderRouter = require('./routers/order')

//Initialize Express API????
const app = express()


//Express static paths (html, css, js)
const publicDirectoryPath = path.join(__dirname, '../public')
// const viewsPath = path.join(__dirname, '../templates/views')
// const partialsPath = path.join(__dirname, '../templates/partials')

//Setting up hbs library and view location
// app.set('view engine', 'hbs')
// hbs.partials(partialsPath)

app.use(express.static(publicDirectoryPath))
// app.use(express.static(viewsPath))
// app.use(express.static(partialsPath))

//Customize server to be able to parse JSON (that we provide in the body of request) to Object 
app.use(express.json())

//Customize routes from different Endpoints for simplicity
app.use(adminRouter)
app.use(merchantRouter)
app.use(orderRouter)

module.exports = app
