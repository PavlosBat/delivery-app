//CONNECT CLIENT to WEBSOCKETS
const socket = io()

//LOCAL MEMORY
let orderDetailsMap = {}
let merchantId = null
let viewedOrderId = null

//ELEMENTS
//check again button?????
const $finalizeButton = document.querySelector('#button')
const $clickItem = document.querySelectorAll('.order-item')

//TEMPLATES
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const detailsTemplate = document.querySelector('#order-details-template').innerHTML

//FUNCTIONS
//F1.Convert Order Details to String ??? OR FROM ACTIVE ORDERS FILE?????????
function orderDetailsToString (order) { 
    return order.toString()
}

//F2.Display Order Details ΝΑ ΒΑΛΩ ΤΟΝ ΜΕΡΤΣΑΝΤ???? Ή ΟΧΙ???
function displayOrderDetails (id, merchantId) {
    const order = orderDetailsMap[id]
    if (order) {
        // currentOrderId = order._id  ????not needed???
        const detailsHtml = Mustache.render(detailsTemplate, {
            merchId: merchantId, //keys are named as variables e.g. {{merchId}} used in Mustache
            _id: order._id, 
            detailsString: orderDetailsToString(order) 
        })
        document.querySelector('#orderDetails').innerHTML = detailsHtml
    }
}

//F3.Click on List Items Event Listener ΝΑ ΒΑΛΩ ΤΟΝ ΜΕΡΤΣΑΝΤ??? ΚΑΙ ΜΕΤΑ???
function attachClickEventToOrderList (merchantId) {
    $clickItem.forEach((item) => {
        item.addEventListener('click', (event) => {
            const orderId = event.target.dataset.orderId
            displayOrderDetails(orderId, merchantId)
        })
    })
}

//LISTENERS
//Listen Connection & render Current Orders in sidebar list + order details
socket.on('currentOrders', (data) => {

    //store merchantId for room identifier????OK??
    merchantId = data.merchantId

    //render sidebar
    const html = Mustache.render(sidebarTemplate, {dataforList: data.dataForList}) //key is named as variable {{dataForList}} used in Mustache
    document.querySelector('#ordersList').innerHTML = html

    //store order details 
    data.fullDetails.forEach(order => {
        orderDetailsMap[order._id] = order
    })

    //click event in every order list item
    attachClickEventToOrderList(merchantId)
})

//Listen New Order & render Updated Orders in sidebar list + order details
socket.on('newOrder', (data) => {
    console.log("New order received")

    //store merchantId for room identifier????OK??
    merchantId = data.merchantId

    //render sidebar
    const html = Mustache.render(sidebarTemplate, {dataForList: data.dataForList}) //key is named as variable {{dataForList}} used in Mustache
    document.querySelector('#ordersList').innerHTML = html

    //store order details
    data.fullDetails.forEach(order => {
        orderDetailsMap[order._id] = order
    })
    //click event in every order list item
    attachClickEventToOrderList(merchantId)
})

//Emit order finalization (from button) to server (where removal will take place and updated list will be sent back)
$finalizeButton.addEventListener('click', () => {
    if (viewedOrderId && merchantId) {
        socket.emit('finalizeOrder', {viewedOrderId, merchantId})
    }
})



//FUNCTIONS FOR ORDERS
// function showNewOrderAlert() {
//     const alertContainer = document.getElementById('alertContainer');
//     alertContainer.style.display = 'flex';
// }

// function closeAlert() {
//     const alertContainer = document.getElementById('alertContainer');
//     alertContainer.style.display = 'none';
// }

// function addOrderToList(order) {
//     const ordersList = document.getElementById('ordersList');
//     const orderDiv = document.createElement('div');
//     orderDiv.innerHTML = `Order ID: ${order._id}`;
//     orderDiv.onclick = () => showOrderDetails(order);
//     ordersList.appendChild(orderDiv);
// }

// function showOrderDetails(order) {
//     const orderDetails = document.getElementById('orderDetails');
//     orderDetails.innerHTML = `<p>Order ID: ${order._id}</p><button onclick="finalizeOrder('${order._id}')">Finalize Order</button>`;
// }

// //????
// function finalizeOrder(orderId) {
//     // Implement the logic to update the order status and remove it from the list
//     console.log('Finalizing order:', orderId);
// }



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
