const mongoose = require('mongoose')
const validator = require('validator')
const EventEmitter = require('events')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const {updateExchangeRates, convertPrice} = require('../utils/currencies')

// Mongoose Schema for orders
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
            if (!validator.isEmail(value)) { //npm validator method
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
    targetCurrency: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['EUR', 'USD', 'GBP', 'JPY'],
        default: 'EUR'
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
            },
            currency: {
                type: String
            }
        }
    }],
    moneyAmount: {
        value:{
            type: Number
        },
        currency: {
            type: String
        },
        basedOnEuroRate: {
            type: Number
        }
    },
    //??? comment if not use Stripe
    // paymentMethod: {
    //     type: String
    // },
    status: {
        type: String,
        default: 'Received and pending'
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

// Method to get the Order Object documents we want -> to present publicly when profile is requested
// to.....
// toObject (mongoose method)//
orderSchema.methods.toJSON = function () {
    const order = this
    const orderObject = order.toObject()

    delete orderObject.tokens

    return orderObject
}

// Method to calculate the moneyAmount
orderSchema.methods.calculateTotalAmount = async function () {
    const order = this
    let totalAmount = 0

    order.cart.forEach((itemObj) => {
            totalAmount += itemObj.item.quantity * itemObj.item.price
    }) 
    
    order.moneyAmount.value = parseFloat(totalAmount.toFixed(2))
    order.moneyAmount.currency = order.targetCurrency
}

// Generate JWToken for Authorization (Middleware)//
orderSchema.methods.generateAuthToken = async function() {
    const order = this
    const token = jwt.sign({ _id: order._id.toString() }, process.env.JWT_SECRET_ORDER)

    order.tokens = order.tokens.concat({ token })

    return token 
}

// Validation for existing "shop" field (Merchant _id)????????? 
// orderSchema.pre('save', async function(next) {
//     const order = this
//     const merchantExists = await mongoose.model('Merchant').exists({ _id: order.shop })
//     if (!merchantExists) {
//         throw new Error('Merchant not found')
//     }
//     next()
// })

// Convert prices to chosen currency
orderSchema.pre('save', async function(next) {
    const order = this
    try {
        // fetch exchange rates
        await updateExchangeRates()

        // check if need to convert currency
        if (order.targetCurrency && order.targetCurrency !== 'EUR') {

            // convert each item's price and update currency field and populate moneyAmount.basedOnEuroRate field
            for (const item of order.cart) { 
                // console.log('Item before conversion:', item) // for debugging!!!!
                
                const { convertedAmount, rate } = convertPrice(item.item.price, order.targetCurrency)
                item.item.price = convertedAmount
                order.moneyAmount.basedOnEuroRate = rate
                // console.log(item.item.price) // for debugging!!!!
                item.item.currency = order.targetCurrency
                // console.log(item.item.currency) // for debugging!!!!
            }
    }
    console.log(order.cart)//for debugging!!!!
    next()
    } catch (e) {
        throw new Error('Error converting prices to chosen currency')
    }
})

// Calculate the total money amount of the order
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

// Create model from schema
const Order = mongoose.model('Order', orderSchema)

// Define Order Event Emitter for newOrder (to avoid using WebSockets inside Express routes)
class OrderEventEmitter extends EventEmitter{}
const orderEventEmitter = new OrderEventEmitter

module.exports = {
    Order,
    orderEventEmitter
}
    