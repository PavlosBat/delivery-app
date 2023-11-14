const activeOrders = []

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

    //Add a property of timeOnly in the order Object (comparison factor for index)
    const orderTime = newOrder.createdAt.getTime()
    newOrder.timeOnly = orderTime
    
    //Find insert index in a time ascending order: 1st oldest time(past) -> 2nd younger time(lesser past), 3rd...)
    const findInsertIndex = (orderList, orderNew) => {
        const insertIndex = orderList.findIndex((order) => order.timeOnly > orderNew.timeOnly)
        
        return insertIndex === -1 ? activeOrders.length : insertIndex
    }
    const listInsertIndex = findInsertIndex(activeOrders, newOrder)

    //Store & return new order
    activeOrders.splice(listInsertIndex, 0, newOrder)
    
    return newOrder
}

//Remove to Active Orders (Details & List), OK!
const removeActiveOrder = (id) => {
    const index = activeOrders.findIndex((activeOrder) => {
        return activeOrder._id === id
    })

    //remove with JS splice() method
    if (index !==-1) {
        //the activeOrders array is updated by the splice method 
        //even if we don't use the [0] bellow 
        //we do it in order to have returned the removed OBJECT
        //instead of the removed ARRAY object
        return activeOrders.splice(index, 1)[0]
    }
}

//Get the active orders of specific merchant, OK!
const getActiveOrdersForMerchant = (merchantId) => {
    const activeListForId = activeOrders.filter((order) => {
        return order.shop === merchantId
    })
    return activeListForId
}

//Sanitize list data for rendering, OK!
const sanitizeList = (activeListForId) => {
    const dashboardList = []
    activeListForId.forEach((order) => {
        dashboardList.push({
            _id: order._id,
            listName: order.timeOnly + '' + order.street + '' + order.number + '' + order.ringBellName
        })
    })
    return dashboardList
}

module.exports = {
    addActiveOrder,
    removeActiveOrder,
    getActiveOrdersForMerchant,
    sanitizeList
}

// generateOrderDetails

//??? NOT READY YET
// const generateOrderDetails = (order) => {
//     const detailItem = order.toString()
//     return detailItem
// }