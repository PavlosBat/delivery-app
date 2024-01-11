
// FILE INDEPENTNT TESTING 
// const mongoose = require('mongoose') //for testing solo
// const { Merchant } = require('../models/merchant') //for testing solo

// const mongoURI = 'mongodb://127.0.0.1:27017/delivery-app-api' //for testing solo
// mongoose.connect(mongoURI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true
    // }) //for testing solo   
    // .then(() => console.log('MongoDB connected...')) //for testing solo
    // .catch((err) => console.error('Could not connect to MongoDB: ', err)) //for testing solo

const { Order } = require('../models/order')
    
let activeOrders = [] // VALID for 1WAY & 2WAY fetchOrdersForMerchant() & fetchOrders() functions

// 2WAY Fetch all orders, OK!
async function fetchOrders() {
    try {
        activeOrders = await Order.find({ status: "Received and pending" }).sort({ createdAt: 1 })
        // console.log('fetch from db activeOrders:', activeOrders)//for debugging!!!!
        return activeOrders
    } catch (error) {
        console.error('Error fetching orders:', error)
        return []
    }
}

// Add to Active Orders (List & Details), OK!
const addActiveOrder = (newOrder) => {
    
    //check if order already exists (.shop for merchantID-room check) & order
    const existingOrder = activeOrders.find((activeOrder) => {
        return activeOrder.shop === newOrder.shop && activeOrder._id === newOrder._id
    })
    
    if (existingOrder) {
        return {
            error: 'newOrder already exists'
        }
    }

    //Add a time tag in the order Object (as a comparison factor for index)
    // const orderTime = newOrder.createdAt.getTime()
    // newOrder.timeOnly = orderTime //check if works without timeOnly model field????????????????
    
    //Find insert index in a time ascending order: 1st oldest time(past) -> 2nd younger time(lesser past), 3rd...)
    // const findInsertIndex = (orderList, orderNew) => {
    //     const insertIndex = orderList.findIndex((order) => order.timeOnly > orderNew.timeOnly)
        
    //     return insertIndex === -1 ? activeOrders.length : insertIndex
    // }
    // const insertionIndex = findInsertIndex(activeOrders, newOrder)

    // //Store & return new order
    // activeOrders.splice(insertionIndex, 0, newOrder)

    //push new order in activeOrders array
    activeOrders.push(newOrder)
    return newOrder
}

// Remove to Active Orders (Details & List), OK! Maybe is not needed if I use fetch from db again in server...?????
const removeActiveOrder = (id) => {
    const index = activeOrders.findIndex((activeOrder) => {
        return activeOrder._id === id
    })

    //remove with JS splice() method
    if (index !==-1) {
        //1) the activeOrders array is updated by the splice method 
        //even if we don't use the [0] bellow and 2)
        //we do it in order to have returned the removed OBJECT
        //instead of the removed ARRAY object
        return activeOrders.splice(index, 1)[0]
    }
}

// Get the active orders of specific merchant, MALLON DELETE???????
const getActiveOrdersForMerchant = (merchantId) => {
    // mutate the merchantId (string) to ObjectId
    // const merchantObjectId = new mongoose.Types.ObjectId(merchantId) ????no need????
    const activeListForId = activeOrders.filter((order) => {
        // return order.shop === merchantObjectId
        return order.shop.equals(merchantId)
    })
    // console.log('from getActiveOrdersForMerchant the activeListForId:', activeListForId)//for debugging!!!!
    return activeListForId
}

// Sanitize list data for rendering, OK!
const sanitizeList = (activeOrders) => {

    const dashboardList = []
    
    activeOrders.forEach((order) => {
        dashboardList.push({
            merchantId: order.shop, //!!!!! export for client to know always the merchantId
            _id: order._id,
            listName: order.createdAt + ', ' + order.street + ' ' + order.number + ', ' + order.ringBellName
        })
    })
    
    return dashboardList
}

// async function runTests() {
//     try {
//         await fetchOrders()// for testing solo
//         console.log('activeOrders:', activeOrders)//for testing solo
        
//         // getActiveOrdersForMerchant('6588303bdb9e85c0a88eef49')//for testing solo
//         let merchantOrders = getActiveOrdersForMerchant('6588303bdb9e85c0a88eef49')//for testing solo
//         console.log('merchantOrders:', merchantOrders)//for testing solo
        
//         sanitizeList(merchantOrders)//for testing solo
//         console.log('dashboardList:', sanitizeList(merchantOrders))//for testing solo
//     } catch (error) {
//         console.error('Error running tests:', error)
//     } finally {
//         mongoose.disconnect()
//     }
// }

// runTests()//for testing solo

module.exports = {
    fetchOrders,
    addActiveOrder,
    removeActiveOrder,
    getActiveOrdersForMerchant,
    sanitizeList
}

// 1) USE
// 1WAY Fetch orders for merchant, OK! MALLON DELETE!!!!!!!!!
// async function fetchOrdersForMerchant(merchantId) {
//     try {
//         const activeOrders = await Order.find({ shop: merchantId, status: "Received and pending" }).sort({ createdAt: 1 })
//         return activeOrders
//     } catch (error) {
//         console.error('Error fetching orders:', error)
//         return []
//     }
// }

//Initial way to addActiveOrder !!!!!!!!!!!

//Add to Active Orders (List & Details), OK!
// const addActiveOrder = (newOrder) => {
    
//     //check if order already exists (.shop for merchantID-room check) & order
//     const existingOrder = activeOrders.find((activeOrder) => {
//         return activeOrder.shop === newOrder.shop && activeOrder._id === newOrder._id
//     })
    
//     if (existingOrder) {
//         return {
//             error: 'newOrder already exists'
//         }
//     }

    //Add a time tag in the order Object (as a comparison factor for index)
    // const orderTime = newOrder.createdAt.getTime()
    // newOrder.timeOnly = orderTime //check if works without timeOnly model field????????????????
    
    //Find insert index in a time ascending order: 1st oldest time(past) -> 2nd younger time(lesser past), 3rd...)
    // const findInsertIndex = (orderList, orderNew) => {
    //     const insertIndex = orderList.findIndex((order) => order.timeOnly > orderNew.timeOnly)
        
    //     return insertIndex === -1 ? activeOrders.length : insertIndex
    // }
    // const insertionIndex = findInsertIndex(activeOrders, newOrder)

    // //Store & return new order
    // activeOrders.splice(insertionIndex, 0, newOrder)

//     return newOrder
// }

// 2) USE
//COMPLETE FILE FOR TESTING!!!!!
// const { Order } = require('../models/order')
// const mongoose = require('mongoose') //for testing solo
// const { Merchant } = require('../models/merchant') //for testing solo


// const mongoURI = 'mongodb://127.0.0.1:27017/delivery-app-api' //for testing solo
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }) //for testing solo   
// .then(() => console.log('MongoDB connected...')) //for testing solo
// .catch((err) => console.error('Could not connect to MongoDB: ', err)) //for testing solo

// let activeOrders = [] // VALID for 1WAY & 2WAY fetchOrdersForMerchant() & fetchOrders() functions

// // 2WAY Fetch all orders, OK!
// async function fetchOrders() {
//     try {
//         activeOrders = await Order.find({ status: "Received and pending" }).sort({ createdAt: 1 })
//         console.log('fetch from db activeOrders:', activeOrders)//for debugging!!!!
//         return activeOrders
//     } catch (error) {
//         console.error('Error fetching orders:', error)
//         return []
//     }
// }

// //Add to Active Orders (List & Details), OK!
// const addActiveOrder = (newOrder) => {
    
//     //check if order already exists (.shop for merchantID-room check) & order
//     const existingOrder = activeOrders.find((activeOrder) => {
//         return activeOrder.shop === newOrder.shop && activeOrder._id === newOrder._id
//     })
    
//     if (existingOrder) {
//         return {
//             error: 'newOrder already exists'
//         }
//     }

//     //Add a time tag in the order Object (as a comparison factor for index)
//     // const orderTime = newOrder.createdAt.getTime()
//     // newOrder.timeOnly = orderTime //check if works without timeOnly model field????????????????
    
//     //Find insert index in a time ascending order: 1st oldest time(past) -> 2nd younger time(lesser past), 3rd...)
//     // const findInsertIndex = (orderList, orderNew) => {
//     //     const insertIndex = orderList.findIndex((order) => order.timeOnly > orderNew.timeOnly)
        
//     //     return insertIndex === -1 ? activeOrders.length : insertIndex
//     // }
//     // const insertionIndex = findInsertIndex(activeOrders, newOrder)

//     // //Store & return new order
//     // activeOrders.splice(insertionIndex, 0, newOrder)

//     //push new order in activeOrders array
//     activeOrders.push(newOrder)
//     return newOrder
// }

// //Remove to Active Orders (Details & List), OK!
// const removeActiveOrder = (id) => {
//     const index = activeOrders.findIndex((activeOrder) => {
//         return activeOrder._id === id
//     })

//     //remove with JS splice() method
//     if (index !==-1) {
//         //1) the activeOrders array is updated by the splice method 
//         //even if we don't use the [0] bellow and 2)
//         //we do it in order to have returned the removed OBJECT
//         //instead of the removed ARRAY object
//         return activeOrders.splice(index, 1)[0]
//     }
// }

// //Get the active orders of specific merchant, MALLON DELETE???????
// const getActiveOrdersForMerchant = (merchantId) => {
//     const merchantObjectId = new mongoose.Types.ObjectId(merchantId)
//     const activeListForId = activeOrders.filter((order) => {
//         // return order.shop === merchantObjectId
//         return order.shop.equals(merchantObjectId)
//     })
//     console.log('from getActiveOrdersForMerchant the activeListForId:', activeListForId)//for testing
//     return activeListForId
// }

// //Sanitize list data for rendering, OK!
// const sanitizeList = (activeOrders) => { //argument: activeListForId?????
//     const dashboardList = []
//     // activeListForId.forEach((order) => { !!!!!delete & explain why not!!!!!!!!
//     activeOrders.forEach((order) => {
//         dashboardList.push({
//             merchantId: order.shop, //!!!!! export for client to know always the merchantId
//             _id: order._id,
//             listName: order.createdAt + ', ' + order.street + ' ' + order.number + ', ' + order.ringBellName
//         })
//     })
//     return dashboardList
// }

// async function runTests() {
//     try {
//         await fetchOrders()// for testing solo
//         console.log('activeOrders:', activeOrders)//for testing solo
        
//         // getActiveOrdersForMerchant('6588303bdb9e85c0a88eef49')//for testing solo
//         let merchantOrders = getActiveOrdersForMerchant('6588303bdb9e85c0a88eef49')//for testing solo
//         console.log('merchantOrders:', merchantOrders)//for testing solo
        
//         sanitizeList(merchantOrders)//for testing solo
//         console.log('dashboardList:', sanitizeList(merchantOrders))//for testing solo
//     } catch (error) {
//         console.error('Error running tests:', error)
//     } finally {
//         mongoose.disconnect()
//     }
// }

// runTests()//for testing solo

// module.exports = {
//     // fetchOrdersForMerchant,
//     fetchOrders,
//     addActiveOrder,
//     removeActiveOrder,
//     getActiveOrdersForMerchant,
//     sanitizeList
// }