const jwt = require('jsonwebtoken')
const Admin = require('../models/admin')

//Admin JWT authorization
const authAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN)
        const admin = await Admin.findOne({ _id: decoded._id, 'tokens.token': token})

        if (!admin) {
            throw new Error()
        }

        //save successfull authorized token & admin
        req.token = token
        req.admin = admin
        next()
    } catch (e) {
        res.status(401).send ({ error: 'Please authorize me' })
    }
}

module.exports = authAdmin