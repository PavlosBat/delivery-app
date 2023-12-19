const mongoose = require('mongoose')
const validator = require('validator')

const xRatesSchema = new mongoose.Schema({
    baseCurrency: {
        type: String,
        default: 'EUR'
    },
    rates: {
        USD: {
            type: Number 
        },
        GBP: {
            type: Number
        },
        JPY: {
            type: Number
        }
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}) 

const XRate = mongoose.model('XRate', xRatesSchema)

module.exports = XRate