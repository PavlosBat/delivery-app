//External Modules
const http = require('http')
const app = require('./app')
const socketio = require('socket.io')

//Internal Modules
const {addActiveOrder, removeActiveOrder, getActiveOrdersForMerchant, sanitizeList} = require('./utils/activeOrdersNEW')//check folder!!!!
const {orderEventEmitter} = require('./models/order')
const {merchantLoginEventEmitter} = require('./models/merchant')

//Port
const port = process.env.PORT || 3000

//Modifying express API to be able to connect with 
const httpServer = http.createServer(app)
const io = socketio(httpServer)

//!!!!Scenario 1__Point of socket connection to server => Every time a socket connects the code of the callback runs.
io.on('connection', (socket) => {
    console.log('New WebSocket connection established')
    
    merchantLoginEventEmitter.on('merchantLogin', (merchantId) => {
        
        //Create room based on merchantId 
        socket.join(merchantId)

        //Sanitize order data only for significant merchant and get dashboard list with less data
        const activeOrdersForMerchant = getActiveOrdersForMerchant(merchantId)
        const dataForList = sanitizeList(activeOrdersForMerchant)

        //Send active orders list for rendering
        io.to(merchantId).emit('currentOrders', {
            merchantId,
            dataForList,
            fullDetails: activeOrdersForMerchant
        })
    })

    //Listen when order is finalized to remove it from active orders and change it's status????
    socket.on('finalizeOrder', async (data) => {

        //Retrieve merchantId and orderId for deletion
        const merchantId = data.merchantId
        const orderId = data.viewedOrderId

        //update order status in database??? declare function...
        await updateOrderStatusDatabase(orderId, 'Finalized')

        //remove order from active orders array
        removeActiveOrder(orderId)

        //get updated active order list for significant merchant and get dashboard list
        const activeOrdersForMerchant = getActiveOrdersForMerchant(merchantId)
        const dataForList = sanitizeList(activeOrdersForMerchant)

        //emit the updated active orders to the merchant
        io.to(merchantId).emit('update', {
            merchantId,
            dataForList,
            fullDetails: activeOrdersForMerchant
        })

    })
    
    //Merchant socket disconnection
    socket.on('disconnect', () => {
        console.log('WebSocket Connection terminated')
    })
})


//orderEventEmitter Listener => emit (Socket.io room) to Client(merchants.js)
orderEventEmitter.on('newOrder', (order) => {
    
    //Add new order to active orders (returns error if exists)
    const newOrder = addActiveOrder(order)

    //Take the merchantId to use it as room key
    const merchantId = newOrder.shop
    
    //Sanitize order data only for significant merchant and make get for dashboard list less data
    const activeOrdersForMerchant = getActiveOrdersForMerchant(merchantId)
    const dataForList = sanitizeList(activeOrdersForMerchant)
    
    //Emit updated active orders list to specific merchant
    io.to(merchantId).emit('newOrder', {
        merchantId,
        dataForList,
        fullDetails: activeOrdersForMerchant
    })
})

//Server call
httpServer.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

// //!!!!Scenario 2__merchantLoginEventEmitter Listener => establish a room for the merchantId who logged in
// merchantLoginEventEmitter.on('merchantLogin', (merchantId) => {
//     io.on('connection', (socket) => {
//         console.log('New WebSocket connection established')

//         //Room connection for merchant(client)
//         socket.join(merchantId)

//         //Disconnect merchant (browser tab close)
//         socket.on('disconnect', () => {
//                 console.log('WebSocket Connection terminated')
//         })
//     })
// })

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