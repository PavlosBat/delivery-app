const http = require('http')
// const express = require('express')
const app = require('./app')
const socketio = require('socket.io')

//Modifying express API to be able to connect with 
const httpServer = http.createServer(app)
const io = socketio(httpServer)

const port = process.env.PORT || 3000

//io.socket server
io.on('connection', (socket) => {
    console.log('New WebSocket connection established')

    //Receive login credentials
    socket.on('login', ({email, password}, callback) => {

    })


})

//Server call
httpServer.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})


//GIA DOKIMES !!!
// const Merchant = require('./models/merchant')

//EXAMPLE//
// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))

// app.post('/merchants', async(req, res) => {
//     const postData = new Merchant({
//         name: 'Burger',
//         email: 'burger@gmail.com',
//         password: 'burger12!',
//         menu: {
//             Starters: [{
//                 name: 'salata',
//                 description: 'aggouri, domata',
//                 price: {
//                     value: 4.00,
//                     currency: 'euro'
//                 }
//             }]
//         }
//     })
//     await new Merchant(merchant1).save()
// })