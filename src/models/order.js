const mongoose = require('mongoose')
const validator = require('validator')
const EventEmitter = require('events')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const orderSchema = new mongoose.Schema({
    shop: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Merchant'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    phone: {
        type: String,
        required: true,
        trim: true
        // validate(value) {
        //     if (!validator.isMobilePhone(value, {strictMode: true})) {
        //         throw new Error('Provide a valid mobile number with "+" country code in front')
        //     }
        // }
    },
    city: {
        type: String,
        required: true,
        uppercase: true
    },
    street:{
        type: String,
        required: true,
        uppercase: true
    },
    number: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    postalCode: {
        type: String
        // validate(value) {
        //     if (!validator.isPostalCode(value)) {
        //         throw new Error('Postal code is not valid')
        //     }
        // }
    },
    ringBellName: {
        type: String,
        required: true
    },
    cart: [{
        item: {
            category:{
                type: String,
                required: true,
                enum:['Starters', 'Mains', 'Deserts', 'Drinks']
            },   
            name: {
                type: String
            },
            quantity: {
                type: Number
            },
            price: {
                type: Number
            }
        }
    }],
    moneyAmount: {
        type: Number
        // required: true
        // euro: {
        //     type: String
        // },
        // dollars: {
        //     type: String
        // }
    },
    paymentMethod: {
        type: String
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})

//Method to get the Order Object documents we want -> to present publicly when profile is requested
//to.....
//toObject (mongoose method)//
orderSchema.methods.toJSON = function () {
    const order = this
    const orderObject = order.toObject()

    delete orderObject.tokens

    return orderObject
}

//Method to calculate the moneyAmount
orderSchema.methods.calculateTotalAmount = async function () {
    const order = this
    let totalAmount = 0

    order.cart.forEach((itemObj) => {
            totalAmount += itemObj.item.quantity * itemObj.item.price
    }) 
    
   order.moneyAmount = totalAmount
}

//Generate JWToken for Authorization (Middleware)//
orderSchema.methods.generateAuthToken = async function() {
    const order = this
    const token = jwt.sign({ _id: order._id.toString() }, 'mySecret3')

    order.tokens = order.tokens.concat({ token })
    await order.save()

    return token
    
}

//Authentication with Credentials (email&password)//
// orderSchema.statics.findByCredentials = async (email, password) => {
//     const order = await Order.findOne({ email })
    
//     //Error check with no clear feedback for safety reasons//
//     if (!order) {
//         throw new Error('Unable to login')
//     }

//     const isMatch = await bcrypt.compare(password, order.password)

//     if (!isMatch) {
//         throw new Error('Unable to login')
//     }

//     return merchant    
// }

// Calculate the total money amount of the order//
orderSchema.pre('save', async function(next) {
    const order = this
    try {
        if (order.isModified('cart')) {
            await order.calculateTotalAmount()
        }
        next()
    } catch (e) {
        throw new Error('Error calculating total order money amount')
    }
})

const Order = mongoose.model('Order', orderSchema)

//Define Order Event Emitter for newOrder (to avoid using WebSockets inside Express routes)
class OrderEventEmitter extends EventEmitter{}
const orderEventEmitter = new OrderEventEmitter

module.exports = {
    Order,
    orderEventEmitter
}