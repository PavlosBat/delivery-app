// External Modules
const http = require('http')
const socketio = require('socket.io')
const app = require('./app')

// Internal Modules
const { fetchOrders,
    addActiveOrder,
    removeActiveOrder,
    getActiveOrdersForMerchant,
    sanitizeList } = require('./utils/activeOrdersAll') // 1WAY 

// const {addActiveOrder, 
//     removeActiveOrder,
//     getActiveOrdersForMerchant,
//     sanitizeList} = require('./utils/activeOrdersNEW') // 2WAY

const {orderEventEmitter, Order} = require('./models/order')
const {merchantLoginEventEmitter} = require('./models/merchant')

// Port
const port = process.env.PORT || 3000

// Modifying express API to be able to connect with 
const httpServer = http.createServer(app)
const io = socketio(httpServer)

//!!!!Scenario 1__Point of socket connection to server => Every time a socket connects the code of the callback runs.
io.on('connection', (socket) => {
    console.log('New WebSocket connection established')
    
    merchantLoginEventEmitter.on('merchantLogin', async (merchantId) => { //be sure about async????
        console.log('merchantLogin event emitted')//for debugging!!!!
        
        // Create room based on merchantId 
        socket.join(merchantId)
        console.log('Room created for merchantId:', merchantId)//for debugging!!!!

        // Fetch current active orders from db
        await fetchOrders() 

        // Sanitize order data only for significant merchant and get dashboard list with less data
        const activeOrdersForMerchant = getActiveOrdersForMerchant(merchantId) //added await to test????
        // console.log('activeOrdersForMerchant after login:', activeOrdersForMerchant)//for debugging!!!!
        const dataForList = sanitizeList(activeOrdersForMerchant)
        // console.log('dataForList after login:', dataForList)//for debugging!!!!

        // Send CURRENT active orders list and full details for rendering
        io.to(merchantId).emit('currentOrders', {
            merchantId,
            dataForList,
            fullDetails: activeOrdersForMerchant
        }, () => {
            console.log('currentOrders event emitted') // aknowledgement callback
        })
    })

    // orderEventEmitter Listener => emit (Socket.io room) to Client(merchants.js)
    orderEventEmitter.on('order', async (order) => {

        // fetch current active orders from db ????if needed???
        await fetchOrders()
            
        // Add new order to active orders (returns error if exists)
        const newOrder = addActiveOrder(order)
        console.log('New order added to active orders:', newOrder)//for debugging!!!! 

        // Take the merchantId to use it as room key
        const merchantId = order.shop
        
        // Sanitize order data only for significant merchant and make get for dashboard list less data
        const activeOrdersForMerchant = getActiveOrdersForMerchant(merchantId)
        console.log('activeOrdersForMerchant after new order:', activeOrdersForMerchant)//for debugging!!!!
        const dataForList = sanitizeList(activeOrdersForMerchant)
        console.log('dataForList after new order:', dataForList)//for debugging!!!!
        
        // Emit updated active orders list to specific merchant
        io.to(merchantId).emit('newOrder', {
            merchantId,
            dataForList,
            fullDetails: activeOrdersForMerchant
        }, () => {
            console.log('newOrder event emitted') // aknowledgement callback
        })
    })

    // Listen when order is finalized to remove it from active orders and change it's status????
    socket.on('finalizeOrder', async (data, callback) => {
        callback() // aknowledgement callback

        // retrieve merchantId and orderId for deletion
        // const merchantId = data.merchantId
        // console.log('merchantId from :', merchantId)//for debugging!!!!
        const orderId = data.viewedOrderId
        // console.log('orderId after finalize :', orderId)//for debugging!!!!

        // update in the database the field status of the order to 'Finalized'
        await Order.findOneAndUpdate({ _id: orderId }, { status: 'Finalized' })

        //remove order from cached active orders array
        await fetchOrders()
        // removeActiveOrder(orderId)

        // get updated active order list for significant merchant and get dashboard list
        const activeOrdersForMerchant = getActiveOrdersForMerchant(data.merchantId)
        // console.log('activeOrdersForMerchant after finalize :', activeOrdersForMerchant)//for debugging!!!!
        const dataForList = sanitizeList(activeOrdersForMerchant)
        // console.log('dataForList after finalize :', dataForList)//for debugging!!!!

        // emit the updated active orders to the merchant
        io.to(data.merchantId).emit('updateOrders', {
            merchantId: data.merchantId,
            dataForList,
            fullDetails: activeOrdersForMerchant
        }, () => {
            console.log('updateOrders event emitted') // aknowledgement callback
        })
    })

    // Merchant socket disconnection
    socket.on('disconnect', () => {
        console.log('WebSocket Connection terminated')
    })
})



// Server call
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