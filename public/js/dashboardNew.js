// CONNECT CLIENT to WEBSOCKETS
const socket = io()

// LOCAL MEMORY
let orderDetailsMap = {} //OR {}????? 
let merchantId = null
let viewedOrderId = null

// TEMPLATES
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML //id selector
const detailsTemplate = document.querySelector('#order-details-template').innerHTML //id selector

// FUNCTIONS
// Format order details (object -> string) for rendering
const formatOrderDetails = (order, indent = 0) => {

    let details = ''
    // create indent string
    const indentString = '&nbsp;'.repeat(indent * 4)

    // iterate over Order object
    for (const [key, value] of Object.entries(order)) {


        // check if value is an array
        if (Array.isArray(value)) {
            details += `${indentString}<strong>${key}:</strong><br>` 
            value.forEach((item, index) => { 
                details += `${indentString}${index + 1}. ${typeof item === 'object' ? '<br>' + formatOrderDetails(item, indent + 1) : item}<br>`
            })

        }// check if value is an object
        else if (typeof value === 'object' && value !== null) {
            details += `${indentString}<strong>${key}:</strong> ${key === '_id' ? value : '<br>' + formatOrderDetails(value, indent + 1)}<br>`

        }// check if value is a primitive
         else {
                details += `${indentString}<strong>${key}:</strong> ${value}<br>`
        }
    }

    return details
}

// Display order details in the sidebar
function displayOrderDetails(id) {

    const order = orderDetailsMap[id]

    if (order) {
        viewedOrderId = id
        const detailsHtml = Mustache.render(detailsTemplate, {
            merchId: merchantId,
            _id: order._id,
            detailsString: formatOrderDetails(order, 0)
        })

        document.querySelector('#orderDetails').innerHTML = detailsHtml
    }
}

// Automize function to update the orders cache and in sidebar (used in socket listeners)
function updateOrdersList(data) {

    // save merchantId and order details in local memory
    merchantId = data.merchantId
    data.fullDetails.forEach(order => {
        orderDetailsMap[order._id] = order
    })

    // render the sidebar
    const html = Mustache.render(sidebarTemplate, { dataForList: data.dataForList })
    // console.log('Rendered HTML:', html) //for debugging

    //???clean the sidebar before rendering????? maybe not needed???
    document.querySelector('#ordersListContainer').innerHTML = ''
    // render
    document.querySelector('#ordersListContainer').innerHTML = html
}

// DOMContentLoaded listener that secures that DOM 
// is loaded events can be attached to elements
document.addEventListener('DOMContentLoaded', () => {
    const $ordersList = document.querySelector('#ordersList')
    const $finalizeButton = document.querySelector('#finalizeButton')

    // Attach "click" event listener to the ordersList for displaying the orderDetails
    $ordersList.addEventListener('click', (event) => {

        if (event.target.classList.contains('order-item')) {

            // use of the .active-order class to highlight the selected order
            // and remove the  .active-order class from the previous selected order
            document.querySelectorAll('.order-item').forEach((item) => {
                item.classList.remove('active-order')
            })

            // add the .active-order class to the selected order
            event.target.classList.add('active-order')

            // catch and render the order details in the sidebar
            const orderId = event.target.dataset.orderId
            displayOrderDetails(orderId)
        }
    })

    // Finalization button event listener
    if ($finalizeButton) {
        $finalizeButton.addEventListener('click', () => {
            if (viewedOrderId && merchantId) {
                socket.emit('finalizeOrder', { viewedOrderId, merchantId }, () => {
                    console.log('finalizeOrder event emitted')
                })
            }
        })
    }
})

// SOCKET EVENT LISTENERS
// Current orders
socket.on('currentOrders', (data, callback) => {

    // console.log('currentOrders event received data : ', 
    //     data.merchantId,
    //     data.dataForList,
    //     data.fullDetails
    // )                     //for debugging !!!!

    updateOrdersList(data)
    callback() // aknowledgement callback
})

// New order event
socket.on('newOrder', (data, callback) => {

    // console.log('newOrder event received data : ', 
    //     data.merchantId,
    //     data.dataForList,
    //     data.fullDetails
    // ) //for debugging !!!!

    updateOrdersList(data)
    callback() // aknowledgement callback
})

// Updated orders event (after finalization)
socket.on('updateOrders', (data, callback) => {

    // console.log('updateOrders event received data : ', 
    //     data.merchantId,
    //     data.dataForList,
    //     data.fullDetails
    // ) //for debugging !!!!

   updateOrdersList(data)
   callback() // aknowledgement callback
})