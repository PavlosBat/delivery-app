const { Order } = require('../models/order')

const activeOrders = [] // VALID for 1WAY & 2WAY fetchOrdersForMerchant() & fetchOrders() functions
const activeOrdersByMerchant = {} // VALID for 3WAY fetchOrdersForMerchant() function

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

// 2WAY Fetch all orders, OK!
// async function fetchOrders() {
//     try {
//         const activeOrders = await Order.find({ status: "Received and pending" }).sort({ createdAt: 1 })
//         return activeOrders
//     } catch (error) {
//         console.error('Error fetching orders:', error)
//         return []
//     }
// }

// 3WAY Fetch orders by merchant, OK!
// async function fetchOrdersByMerchant() {
//     try {
//         const activeOrders = await Order.find({ status: "Received and pending" }).sort({ createdAt: 1 })
//         return activeOrders
//     } catch (error) {
//         console.error('Error fetching orders:', error)
//         return []
//     }
// }

//Add to Active Orders (List & Details), OK!
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

//Remove to Active Orders (Details & List), OK!
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

//Get the active orders of specific merchant, MALLON DELETE???????
const getActiveOrdersForMerchant = (merchantId) => {
    const activeListForId = activeOrders.filter((order) => {
        return order.shop === merchantId
    })
    return activeListForId
}

//Sanitize list data for rendering, OK!
const sanitizeList = (activeOrders) => { //argument: activeListForId?????
    const dashboardList = []
    // activeListForId.forEach((order) => {
    activeOrders.forEach((order) => {
        dashboardList.push({
            merchantId: order.shop, //!!!!! export for client to know always the merchantId
            _id: order._id,
            listName: order.timeOnly + '' + order.street + '' + order.number + '' + order.ringBellName
        })
    })
    return dashboardList
}

// generateOrderDetails
//??? NOT READY YET
// const generateOrderDetails = (order) => {
//     const detailItem = order.toString()
//     return { order, detailItem }
// }

module.exports = {
    fetchOrdersForMerchant,
    addActiveOrder,
    removeActiveOrder,
    getActiveOrdersForMerchant,
    sanitizeList
    // generateOrderDetails
}



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