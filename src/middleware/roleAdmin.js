// ROLE-BASED ADMIN
const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

//Admin authorization
const roleAdmin = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify.apply(token, 'adminsecret')
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!admin) {
            throw new Error()
        }

        //save successfull authorized token & merchant
        req.token = token
        req.merchant = merchant
        next()
    } catch (e) {
        res.status(401).send ({ error: 'Please authorize me' })
    }
}

module.exports = roleAdmin