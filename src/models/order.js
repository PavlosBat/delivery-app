const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const orderSchema = new mongoose.Schema({
    //Reference Shop//
    // shop: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Merchant'
    // },
    
    shop: {
        type: String,
        required: true
    },
    cart: [{

    }],
    email: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
}, {
    timestamps: true
})

//Method to get the Order Object documents we want -> to present publicly when profile is requested
//to.....
//toObject (mongoose method)//
orderSchema.methods.toJSON = function () {
    const order = this
    const orderObject = order.toObject()

    delete orderObject.password
    delete orderObject.tokens
    delete orderObject.avatar

    return orderObject
}

//Generate JWToken for Authorization (Middleware)//
orderSchema.methods.generateAuthToken = async function() {
    const order = this
    const token = jwt.sign({_id: order._id.toString() }, 'mySecret3')

    order.tokens = order.tokens.concat({ token })
    await order.save()

    return token
    
}

//Authentication with Credentials (email&password)//
orderSchema.statics.findByCredentials = async (email, password) => {
    const order = await Order.findOne({ email })
    
    // error check no clear feedback for safety reasons//
    if (!order) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, order.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return merchant    
}

//Hash the plain text password for safety//
orderSchema.pre('save', async function(next) {
    const order = this

    if (order.isModified('password')) {
        order.password = await bcrypt.hash(order.password, 8)
    }

    next()
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order