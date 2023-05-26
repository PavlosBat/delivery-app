//PROBLEM IN AUTH AND LOG MERCHANT
const jwt = require('jsonwebtoken')
// const fast2sms = require('fast-two-sms')
const Merchant = require('../models/merchant')

//Merchant JWT Authorization
const authMerch = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'mySecret')
        const merchant = await Merchant.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!merchant) {
            throw new Error()
        }

        //save successfull authorized token & merchant
        req.token = token
        req.merchant = merchant
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authorize me' })
    }
}

module.exports = authMerch