const jwt = require('jsonwebtoken')
// const fast2sms = require('fast-two-sms')
const { Merchant } = require('../models/merchant')

//Merchant JWT Authorization
const authMerch = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        // console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET_MERCHANT)
        // console.log(decoded)
        const merchant = await Merchant.findOne({ _id: decoded._id, 'tokens.token': token })
        // console.log(merchant)

        if (!merchant) {
            throw new Error()
        }

        //save successfull authorized token & merchant
        req.token = token
        req.merchant = merchant

        next()
    } catch (e) {
        console.error("Authentication error: ", e.message)
        res.status(401).send({ error: 'Please authorize me' })
    }
}

module.exports = authMerch