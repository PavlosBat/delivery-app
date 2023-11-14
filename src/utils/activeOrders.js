const activeOrders = []
const activeOrderList = []

//Add to Active Orders (List & Details)
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

    //Store to activeOrderList
    const forList = {
        _id: newOrder._id,
        createdAt: newOrder.createdAt,
        street: newOrder.street,
        number: newOrder.number
    }
    activeOrderList.push(forList)

    //Store & return new order
    const activeOrder = newOrder
    activeOrders.push(activeOrder)

    return {activeOrder, activeOrderList}
}

//Remove to Active Orders (Details & List)
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
        const removedOrderItem = activeOrders.splice(index, 1)[0]
        const removedOrderListItem = activeOrderList.splice(index, 1)[0]
        return {
            removedOrderItem,
            removedOrderListItem
        }
    }
}

//Sort active order list (oldest -> to newest order)
const sortActiveOrderList = (orderList) => {
    
}

//Sanitize order data
// const generateOrderForList = (order) => {
//     const listItem = order._id + order.createdAT + order.street + order.number
//     return listItem
//}

//Get merchants only 

const generateOrderDetails = (order) => {
    const detailItem = order.toString()
    return detailItem
}

module.exports = {
    addActiveOrder,
    removeActiveOrder,
    generateOrderForList,
    generateOrderDetails
}
