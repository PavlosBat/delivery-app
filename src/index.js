const app = require('./app')
//GIA DOKIMES !!!
// const Merchant = require('./models/merchant')

const port = process.env.PORT || 3000

//Server call
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


//GIA DOKIMES !!!

//EXAMPLE//
// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function () {
//     console.log(this)
//     return this
// }

// console.log(JSON.stringify(pet))

// app.post('/merchants', async(req, res) => {
//     const postData = new Merchant({
//         name: 'Burger',
//         email: 'burger@gmail.com',
//         password: 'burger12!',
//         menu: {
//             Starters: [{
//                 name: 'salata',
//                 description: 'aggouri, domata',
//                 price: {
//                     value: 4.00,
//                     currency: 'euro'
//                 }
//             }]
//         }
//     })
//     await new Merchant(merchant1).save()
// })