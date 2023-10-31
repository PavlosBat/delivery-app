// const { Order, orderEventEmitter } = require('../../src/models/order')
// Connect client to WebSockets
const socket = io()

//ELEMENTS
//login page
const $loginForm = document.querySelector('#login-form')

//dashboard page


//TEMPLATES


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


//Event listeners
socket.on('message', (message) => {
    console.log(message)
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
$loginForm.addEventListener('submit', (e) => {
    //
    e.preventDefault()

    const merchUsername = e.target.elements.merchant.value
    const merchPassword = e.target.elements.password.value

    socket.emit('login', {merchUsername, merchPassword})

})

socket.emit('finaliseOrder', (order) => {

    //button + change status of order( patchOrder)
    
})