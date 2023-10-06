const jwt = require('jsonwebtoken')
// const fast2sms = require('fast-two-sms')
const Order = require('../models/order')

//Order JWT Authorization
const authOrder = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ORDER)
        const order = await Order.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!order) {
            throw new Error()
        }

        //save successfull authorized token & order
        req.token = token
        req.order = order
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authorize me' })
    }
}

module.exports = authOrder