// const mongoose = require('mongoose') //for testing
const axios = require('axios')
const XRate = require('../models/xrates')

// const mongoURI =   process.env.MONGOOSE_URI //for testing
// mongoose.connect(mongoURI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }) //for testing
// .then(() => console.log('MongoDB connected...')) //for testing
// .catch((err) => console.error('Could not connect to MongoDB: ', err)) //for testing

let cachedRates = {}

const updateExchangeRates = async() => {
    try {
        //check if rates were updated in last 24h
        const latestRates = await XRate.findOne().sort({timestamp: -1})
        
        //get current time for comparison
        let now = new Date()

        //no entries OR no recent updates
        if (!latestRates || (now - latestRates.timestamp) > 24*60*60*1000) {
            
            //fetch new rates
            const response = await axios.get(`http://data.fixer.io/api/latest?access_key=${process.env.FIXER_API_KEY}&base=EUR&symbols=USD,GBP,JPY`)
            //store them locally
            cachedRates = response.data.rates
            console.log('cachedRates from fixer.io: ', cachedRates)//for debugging !!!
            
            //convert fixer.io (Unix timestamp) to Date Object (as in XRate model) 
            now = new Date(response.data.timestamp * 1000)
            
            //Database update collection XRate with the new rates (NOT single document update in order to keep history of rates)
            const createdDocument = await XRate.create({rates: cachedRates, timestamp: now})
            console.log('createdDocument in XRates collection: ', createdDocument)//for debugging !!!
            

        // OR less than 24h use cachedRates from database 
        } else {
            cachedRates = latestRates.rates
            console.log('cachedRates from localcache: ', cachedRates)//for debugging !!!
        }

    } catch (error) {
        console.error('Error fetching exchange rates: ', error)
    }
}

//convert price due to the new currency rates
const convertPrice = (amount, targetCurrency) => {
    // console.log('Converting', amount, 'to', targetCurrency)//for debugging !!!
    // console.log('Cached Rates inside convertPrice:', cachedRates)//for debugging !!!
    
    // if I erase below if statement make this let without a value????? 
    //and also leave a comment that the check for eu is done where the function is used!!!!!
    let convertedAmount = amount //let convertedAmount
    
    //try without that if statement!!!!?????
    // if (targetCurrency === 'EUR') {
    //     console.log('Already in EUR')
    // return amount
    // }

    const rate = cachedRates[targetCurrency]
    console.log('used rates log from convertPrice function: ', rate)//for debugging !!!

    if (!rate) {
            throw new Error('Unsupported currency, wrong currency name or missing exchange rate')
        }
        
    convertedAmount = parseFloat(amount * rate).toFixed(2)

    console.log('convertPrice return value: ', convertedAmount)//for debugging !!!
    // return parseFloat(convertedAmount.toFixed(2))
    return { convertedAmount, rate }
}
    

// async function main() { //for debugging !!!
//     await updateExchangeRates() //for debugging !!!
//     await convertPrice(100, 'USD', cachedRates) //for debugging !!!
//     mongoose.disconnect() //for debugging !!!
// }
    
// main() //for debugging !!!

// updateExchangeRates() //for debugging !!!
    
module.exports = {
    updateExchangeRates,
    convertPrice
}

