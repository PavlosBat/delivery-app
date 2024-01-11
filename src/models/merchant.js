const mongoose = require('mongoose')
const validator = require('validator')
const EventEmitter = require('events')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const merchantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length < 8) {
                throw new Error('Password must have more than 7 characters')
            }
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    telephone: {
        type: String,
        required: true,
        trim: true
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
        trim: true
    },
    postalCode: {
        type: String,
        // validate(value) {
        //     if (!validator.isPostalCode(value)) {
        //         throw new Error('Postal code is not valid')
        //     }
        // }
    },
    //in case of role-based access://

    // isAdmin: {
    //     type: Boolean,
    //     default: false
    // },
    menu: [{
        category: {
            type: String,
            required: true,
            enum: ['Starters', 'Mains', 'Deserts', 'Drinks']
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true
        },
        price: {
            value: {
                type: Number,
                required: true
            },
            currency: {
                type: String,
                uppercase: true,
                default: "EUR" 
            }
        }
        // Starters: [{
        //     name: {
        //         type: String,
        //         required: true
        //     },
        //     description: {
        //         type: String,
        //         required: true
        //     },
        //     quantity: {
        //         type: Number,
        //         required: true
        //     },
        //     price: {
        //         value: {
        //             type: Number,
        //             required: true
        //         },
        //         currency: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // }],
        // Mains: [{
        //     name: {
        //         type: String,
        //         required: true,
        //         trim: true
        //     },
        //     description: {
        //         type: String,
        //         required: true
        //     },
        //     quantity: {
        //         type: Number,
        //         required: true
        //     },
        //     price: {
        //         value: {
        //             type: Number,
        //             required: true
        //         },
        //         currency: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // }],
        // Deserts: [{
        //     name: {
        //         type: String,
        //         required: true,
        //         trim: true
        //     },
        //     description: {
        //         type: String,
        //         required: true
        //     },
        //     quantity: {
        //         type: Number,
        //         required: true
        //     },
        //     price: {
        //         value: {
        //             type: Number,
        //             required: true
        //         },
        //         currency: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // }],
        // Drinks: [{
        //     name: {
        //         type: String,
        //         required: true,
        //         trim: true
        //     },
        //     description: {
        //         type: String,
        //         required: true
        //     },
        //     quantity: {
        //         type: Number,
        //         required: true
        //     },
        //     price: {
        //         value: {
        //             type: Number,
        //             required: true
        //         },
        //         currency: {
        //             type: String,
        //             required: true
        //         }
        //     }
        // }]
    }],
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }],
    // avatar: {
    //     type: Buffer
    // },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    //explanation???
    toJSON: {
        virtuals: true
    },
    //explanation???
    toObject: {
        virtuals: true
    },
    timestamps: true
})

// Virtual Populate Orders ???other fields also??? +explanation???
merchantSchema.virtual('ordersList', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'shop'
})

//Method to get the Merchant Object documents we want -> to present publicly when profile is requested
//to.....
//toObject (mongoose method)
merchantSchema.methods.toJSON = function () {
    const merchant = this
    const merchantObject = merchant.toObject()

    delete merchantObject.password
    delete merchantObject.tokens
    delete merchantObject.avatar

    return merchantObject
}

//Generate JWToken for Authorization (Middleware)
merchantSchema.methods.generateAuthToken = async function() {
    const merchant = this
    const token = jwt.sign({_id: merchant._id.toString() }, process.env.JWT_SECRET_MERCHANT)

    merchant.tokens = merchant.tokens.concat({ token })
    await merchant.save()

    return token  
}

//Authentication with Credentials (email&password)
merchantSchema.statics.findByCredentials = async (email, password) => {
    const merchant = await Merchant.findOne({ email })
    
    //error check no clear feedback for safety reasons
    if (!merchant) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, merchant.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return merchant    
}

//Hash the plain text password for safety 
merchantSchema.pre('save', async function(next) {
    const merchant = this

    if (merchant.isModified('password')) {
        merchant.password = await bcrypt.hash(merchant.password, 8)
    }

    next()
})

//Create model from schema
const Merchant = mongoose.model('Merchant', merchantSchema)

//Define Merchant Event Emitter for merchant login (to avoid using WebSockets inside Express routes)
class MerchantEventEmitter extends EventEmitter{}
const merchantLoginEventEmitter = new MerchantEventEmitter

module.exports = {
    Merchant,
    merchantLoginEventEmitter
}