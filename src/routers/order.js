const express = require('express')

const Order = require('../models/order')
const authOrder = require('../middleware/auth')
const router = new express.Router()

router.post('/orders', async (req, res) => {
    const order = new Order(req.body)
    try {
        await order.save()
        const token = await order.generateAuthToken()
        res.status(201).send( {order, token} )
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router