const express = require('express')
const { Order, orderEventEmitter } = require('../models/order')
const authOrder = require('../middleware/authOrder')
const router = new express.Router()

// OK !!! BUT NEEDS PAYMENT
router.post('/orders', async (req, res) => {
    const order = new Order(req.body)

    try {
        await order.save()

        //Node.js EventEmit newOrder _alert merchant!! It needs to use rooms & maybe need to clear some data that merchant can see in his page
        orderEventEmitter.emit('newOrder', order)

        const token = await order.generateAuthToken()
        res.status(201).send( {order, token} )
    } catch (e) {
        res.status(400).send('Client side error')
    }
})

// OK
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

//
router.patch('/orders/myOrder', authOrder, async (req, res) => {
//time cap of 3min 

    const updates = Object.keys(req.body)
    const allowedUpdates = ['phone','city','street', 'number', 'postalCode', 'ringBellName', 'cart']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({Error: 'Invalid updates'})
    }

    try {
        updates.forEach((update) => req.order[update] = req.body[update])
        await req.order.save()
        res.send(req.order)
    } catch (e) {
        res.status(500).send()
    }
})

// 
router.delete('/orders/myOrder', authOrder, async (req, res) => {
    //???????????????time cap of 2min or + autocancel if payment fails
    try {
        await req.order.deleteOne()
        res.send(req.order)
    } catch (e) {
        res.status(500).send({Error: e.message})
    }
})

module.exports = router