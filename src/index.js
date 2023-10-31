const http = require('http')
// const express = require('express')
const app = require('./app')
const {orderEventEmitter} = require('./models/order')
const {merchantLoginEventEmitter} = require('./models/merchant')
const socketio = require('socket.io')

//Modifying express API to be able to connect with 
const httpServer = http.createServer(app)
const io = socketio(httpServer)

//Middleware to add socket to req object
app.use((req, res, next) => {
    req.io = io
    next()
})

const port = process.env.PORT || 3000

//???ΜΑΛΛΟΝ ΑΚΥΡΟ??? io.socket server GENERAL
io.on('connection', (socket) => {
    console.log('New WebSocket connection established')

    //EventEmitter scenario
    // merchantLoginEventEmitter.on('merchantLogin', (merchantId) => {
    //     socket.emit('join')

    // })

    socket.on('disconnect', () => {
        io.emit('message', 'WebSocket Connection terminated')
    })
})

// //io.socket Server Room for each Merchant
// merchantLoginEventEmitter.on('merchantLogin', (merchantId) => {
//     io.on('connection', (socket) => {
//         socket.join(merchantId)
//         console.log('New Web Socket connection established!')

//     })
// })

//orderEventEmitter Listener => and emit (Socket.io room) to Client(merchants.js)
orderEventEmitter.on('newOrder', (order) => {
    io.to(order.shop.toString()).emit('newOrder', order)
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