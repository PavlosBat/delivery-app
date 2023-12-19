const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/delivery-app-api')
mongoose.connect(process.env.MONGOOSE_URI)