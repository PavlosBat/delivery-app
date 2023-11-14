// Connect client to WebSockets
const socket = io()

//ELEMENTS
//check again button
const $finalizeButton = document.querySelector('#button')

//TEMPLATES
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const detailsTemplate = document.querySelector().innerHTML

//LISTENERS
//Listen Connection & render order list
socket.on('currentOrders', (dataForList) => {
    const html = Mustache.render(sidebarTemplate, dataForList)
    document.querySelector('#ordersList').innerHTML = html
})

//Listen New Order & render updated order list 
socket.on('newOrder', (dataForlist) => {
    console.log("New order received")
    const html = Mustache.render(detailsTemplate, dataForList)
    document.querySelector('').innerHTML = html //#id name
})

//EMITTERS???
//Emit order finalization (from button) to server (where removal will take place and updated list will be sent back)
$finalizeButton.addEventListener('click', () => {

})

//Emit 




//dashboard page




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
