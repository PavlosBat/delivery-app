const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { Merchant } = require('../../src/models/merchant')
const { Order } = require('../../src/models/order')
const XRate = require('../../src/models/xrates')


//Collection documents
const oldExRates = new XRate({

})

const merchantOne = new Merchant({

})

const merchantTwo = new Merchant({

})

const orderOne = new Order({

})

const orderTwo = new Order({

})



//Function for creating the db
const setupDatabase = async () => {
    
}

module.exports = {
    oldExRates,
    merchantOne,
    merchantTwo,
    orderOne,
    orderTwo,
    setupDatabase
}