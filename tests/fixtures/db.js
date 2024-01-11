const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const { Merchant } = require('../../src/models/merchant')
const { Order } = require('../../src/models/order')
const XRate = require('../../src/models/xrates')


//COLLECTION DOCUMENTS

//Exchange rates
const oldExRatesId = new mongoose.Types.ObjectId()
const oldExRates = new {
    _id: oldExRatesId,
    baseCurrency: 'EUR',
    rates: {
        USD: 1.09547,
        GBP: 0.86088,
        JPY: 158.443308
    },
    timestamp: new Date("2024-01-07T10:00:00.000+00")
}

// Merchants
const merchantOneId = new mongoose.Types.ObjectId()
const merchantOne = {
    _id: merchantOneId,
    name: "Pizzaria",
    email: "pizzaria@gmail.com",
    telephone: "1234567890",
    password: "pizzaria12!",
    city: "IOANNINA",
    street: "STADIOU",
    number: "15",
    postalCode: "12345",
    menu: [{
        category: "Starters",
            name: "greek salad",
            description: "tomato, cucamber, feta cheese, onions, olives",
            stock: 220,
            price: {
                value: 5.50,
                currency: "EUR"
            }
        },{
        category: "Mains",
            name: "pizza margharita",
            description: "tomato sauce, mozzarela, oregano",
            stock: 300,
            price: {
                value: 8.50,
                currency: "EUR"
            }
        }
    ]
}

const merchantTwoId = new mongoose.Types.ObjectId()
const merchantTwo = {
    _id: merchantTwoId,
    name: "Sushi Bar",
    email: "sushibar@gmail.com",
    telephone: "1234567890",
    password: "sushibar12!",
    city: "IOANNINA",
    street: "IONIAS",
    number: "20",
    postalCode: "12345",
    menu: [{ // change that
        category: "Starters",
            name: "spring rolls",
            description: "tomato, cucamber, pepper, onions, phyllo, sweet chilli sauce",
            stock: 220,
            price: {
                value: 4.00,
                currency: "EUR"
            }
        },{
        category: "Mains",
            name: "maki sushi",
            description: "12 pieces, seaweed, steamed rice, salmon, avocado",
            stock: 300,
            price: {
                value: 12.50,
                currency: "EUR"
            }
        }
    ]
}

// Orders
const orderOneId = new mongoose.Types.ObjectId()
const orderOne = {
    _id: orderOneId,
    shop: merchantOneId,
    email: "pavlos@gmail.com",
    phone: "0987654321",
    city: "IOANNINA",
    street: "MAGGELOU",
    number: "123",
    postalCode: "44445",
    ringBellName: "Pavlos B",
    targetCurrency: "EUR",
    cart: [{
        item: {
            category: "Starters",
            name: "greek salad",
            quantity: 1,
            price: 5.50,
            currency: "EUR"
           }
        },
        {
        item: {
            category: "Mains",
            name:"pizza margharita",
            quantity: 1,
            price: 8.50,
            currency: "EUR"
            }
        }
    ]
}


const orderTwoId = new mongoose.Types.ObjectId()
const orderTwo = {
    _id: orderTwoId,
    shop: merchantTwoId,
    email: "kostas@gmail.com",
    phone: "0987654321",
    city: "IOANNINA",
    street: "ASKLIPEIOU",
    number: "123",
    postalCode: "44445",
    ringBellName: "Kostas B",
    targetCurrency: "USD",
    cart: [{
        item: {
            category: "Starters",
            name: "spring rolls",
            quantity: 1,
            price: 4.00,
            currency: "EUR"
           }
        },
        {
        item: {
            category: "Mains",
            name:"maki sushi",
            quantity: 3,
            price: 12.50,
            currency: "EUR"
            }
        }
    ]
}

const orderThreeId = new mongoose.Types.ObjectId()
const orderThree = {
    _id: orderThreeId,
    shop: merchantTwoId,
    email: "kostas@gmail.com",
    phone: "0987654321",
    city: "IOANNINA",
    street: "ASKLIPEIOU",
    number: "123",
    postalCode: "44445",
    ringBellName: "Kostas B",
    targetCurrency: "JPY",
    cart: [{
        item: {
            category: "Starters",
            name: "spring rolls",
            quantity: 1,
            price: 4.00,
            currency: "EUR"
           }
        },
        {
        item: {
            category: "Mains",
            name:"maki sushi",
            quantity: 1,
            price: 12.50,
            currency: "EUR"
            }
        }
    ]
} 


//Function for creating the db
const setupDatabase = async () => {
    await XRate.deleteMany()
    await Merchant.deleteMany()
    await Order.deleteMany()
    await new Merchant(merchantOne).save()
    await new User(merchantTwo).save()
    await new Task(orderOne).save()
    await new Task(orderTwo).save()
    await new Task(orderThree).save()
}

module.exports = {
    oldExRates,
    merchantOneId,
    merchantTwoId,
    merchantOne,
    merchantTwo,
    orderOneId,
    orderTwoId,
    orderThreeId,
    orderOne,
    orderTwo,
    orderThree,
    setupDatabase
}