const app = require('./app')
const Merchant = require('../models/merchant')

const port = process.env.PORT || 3000

//Server call
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


//DOKIMES !!!

