const express = require('express')

const { Order, orderEventEmitter } = require('../models/order')
const { Merchant } = require('../models/merchant')
const authOrder = require('../middleware/authOrder')
const { sendOrderConfirmationEmail,
    sendOrderUpdateEmail,
    sendOrderCancelationEmail } = require('../email/account')

// Initiate express router
const router = new express.Router()

// Create order OK!!! 
router.post('/orders', async (req, res) => {
    const order = new Order(req.body)

    try {
        // 'shop' (Merchant _id) existance validation
        const merchantExists = await Merchant.exists({ _id: order.shop})
        if (!merchantExists) {
            return res.status(404).send({Error: 'Merchant not found'})
        }

        // Node.js EventEmit newOrder in merchant dashboard
        orderEventEmitter.emit('order', order)
        
        // Generate JWToken for Authorization (It does NOT save the order !)
        const token = await order.generateAuthToken()

        // save order to database !!!without token (security)
        await order.save()
        
        // automated email for updating Order !!!COMMENT IN DEV MODE unless it is mocked!!! 
        // sendOrderConfirmationEmail(order.email, order.ringBellName, order.shop)

        // updating Merchant to store order in his orders field
        await Merchant.findByIdAndUpdate(order.shop, { $push: { orders: order._id } })

        res.status(201).send( {order, token} )
    } catch (e) {
        res.status(400).send('Client side error')
    }
})

// Read Order OK
router.get('/orders/myOrder', authOrder, async (req, res) => {
    try {
        if (!req.order) {
            return res.status(404).send({Error: 'Order not found'})
        }

        res.send(req.order)
    } catch (e) {
        res.status(500).send('Server side error')
    }
})

// Update Order OK???
router.patch('/orders/myOrder', authOrder, async (req, res) => {

    //++++ timecap 3min after order creation to be able to change order details!!!!!

    const updates = Object.keys(req.body)
    const allowedUpdates = ['phone','city','street', 'number', 'postalCode', 'ringBellName', 'cart']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({Error: 'Invalid updates'})
    }

    try {
        updates.forEach((update) => req.order[update] = req.body[update])
        await req.order.save()

        // // automated email for new Order !!!COMMENT IN DEV MODE unless it is mocked!!! 
        // sendOrderUpdateEmail(order.email, order.ringBellName, order.shop)

        res.send(req.order)
    } catch (e) {
        res.status(500).send()
    }
})

//Delete Order OK???
router.delete('/orders/myOrder', authOrder, async (req, res) => {
    //???????????????time cap of 2min or + autocancel if payment fails
    try {
        await req.order.deleteOne()

        // automated email for deleting Order !!!COMMENT IN DEV MODE unless it is mocked!!! 
        // sendOrderCancelationEmail(order.email, order.ringBellName, order.shop)

        res.send(req.order)
    } catch (e) {
        res.status(500).send({Error: e.message})
    }
})

module.exports = router