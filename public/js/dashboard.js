//CONNECT CLIENT to WEBSOCKETS
const socket = io()

//LOCAL MEMORY
let orderDetailsMap = {}
let viewedMerchantId = null //before was merchantId????
let viewedOrderId = null

//ELEMENTS
//check again button?????
// const $finalizeButton = document.querySelector('#finalizeButton')
const $clickItem = document.querySelectorAll('.order-item')

//TEMPLATES
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const detailsTemplate = document.querySelector('#order-details-template').innerHTML

//FUNCTIONS
//F1.Convert Order Details to String ??? OR FROM ACTIVE ORDERS FILE?????????
//Is convertion needed for rendering????? 
// function orderDetailsToString (order) { 
//     return order.toString()
// }

//F2.Display Order Details ΝΑ ΒΑΛΩ ΤΟΝ ΜΕΡΤΣΑΝΤ???? Ή ΟΧΙ???

//In displayOrderDetails() I want to store in a variable the current orderId and merchantId 
//so when I click on finalize button I can emit the event to the server 
//with the correct room identifier (merchantId) and orderId for deletion
function displayOrderDetails (id, merchantId) {
    const order = orderDetailsMap[id]
    if (order) {
        viewedOrderId = order._id
        viewedMerchantId = merchantId
        const detailsHtml = Mustache.render(detailsTemplate, {
            merchId: merchantId, //keys are named as variables e.g. {{merchId}} used in Mustache
            _id: order._id, 
            detailsString: order
            // detailsString: orderDetailsToString(order) 
        })
        document.querySelector('#orderDetails').innerHTML = detailsHtml
    }
}


// function displayOrderDetails (id, merchantId) {
//     const order = orderDetailsMap[id]
//     if (order) {
//         // currentOrderId = order._id  ????not needed???
//         const detailsHtml = Mustache.render(detailsTemplate, {
//             merchId: merchantId, //keys are named as variables e.g. {{merchId}} used in Mustache
//             _id: order._id, 
//             detailsString: orderDetailsToString(order) 
//         })
//         document.querySelector('#orderDetails').innerHTML = detailsHtml
//     }
// }

//F3.Click on List Items Event Listener ΝΑ ΒΑΛΩ ΤΟΝ ΜΕΡΤΣΑΝΤ??? ΚΑΙ ΜΕΤΑ???
function attachClickEventToOrderList (merchant) {
    $clickItem.forEach((item) => {
        item.addEventListener('click', (event) => {
            const orderId = event.target.dataset.orderId
            displayOrderDetails(orderId, merchant)
        })
    })
}

//LISTENERS
//Listen Connection & render Current Orders in sidebar list + order details
socket.on('currentOrders', (data) => {

    //store merchantId for room identifier????OK??
    const merchantId = data.merchantId
    
    //store order details 
    data.fullDetails.forEach(order => {
        orderDetailsMap[order._id] = order
    })

    //render sidebar
    const html = Mustache.render(sidebarTemplate, {dataforList: data.dataForList}) //key is named as variable {{dataForList}} used in Mustache
    document.querySelector('#ordersList').innerHTML = html

    //click event for every list item (merchantId passed for room identifier in socket.emit('finalizeOrder'))
    attachClickEventToOrderList(merchantId)
})

//Listen New Order & render Updated Orders in sidebar list + order details
socket.on('newOrder', (data) => {
    console.log("New order received")

    //store merchantId for room identifier????OK??
    const merchantId = data.merchantId
    
    //store order details
    data.fullDetails.forEach(order => {
        orderDetailsMap[order._id] = order
    })

    //render sidebar
    const html = Mustache.render(sidebarTemplate, {dataForList: data.dataForList}) //key is named as variable {{dataForList}} used in Mustache
    document.querySelector('#ordersList').innerHTML = html

    //click event in every order list item
    attachClickEventToOrderList(merchantId)
})

//Listen for Updated Orders afterthe finalization of an order
socket.on('updatedOrders', (data) => {
    console.log("Updated orders received")

    //store merchantId for room identifier????OK??
    const merchantId = data.merchantId
    
    //store order details
    data.fullDetails.forEach(order => {
        orderDetailsMap[order._id] = order
    })

    //render sidebar
    const html = Mustache.render(sidebarTemplate, {dataForList: data.dataForList}) //key is named as variable {{dataForList}} used in Mustache
    document.querySelector('#ordersList').innerHTML = html

    //click event in every order list item
    attachClickEventToOrderList(merchantId)
})

//Emit order finalization (from button) to server (where removal will take place and updated list will be sent back)
document.addEventListener('DOMContentLoaded', () => {
    const $finalizeButton = document.querySelector('#finalizeButton')

    // Check if the button exists to avoid null reference errors
    if ($finalizeButton) {

        $finalizeButton.addEventListener('click', () => {   
            if (viewedOrderId && viewedMerchantId) {
                socket.emit('finalizeOrder', {viewedOrderId, viewedMerchantId}) //test if room identifier needed????
            }
        })
    }
})

//location Example
// document.querySelector('#send-location').addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         return alert('Geolocation is not supported in your browser')
//     }

//     navigator.geolocation.getCurrentPosition((position) => {
//         console.log(position)
//     })
// })



//EMIT EVENTS
//Login Inputs
// $loginForm.addEventListener('submit', (e) => {
//     //
//     e.preventDefault()

//     const merchUsername = e.target.elements.merchant.value
//     const merchPassword = e.target.elements.password.value

//     socket.emit('login', {merchUsername, merchPassword})

// })
