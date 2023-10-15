const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
// const { update } = require('../models/merchant')
const Merchant = require('../models/merchant')
const authMerch = require('../middleware/authMerch')
const router = new express.Router()

// //1.Create new Merchant or ADMIN Merchant...OK
// router.post('/merchants', async(req, res) => {
//     const merchant = new Merchant(req.body)

//     try {
//         await merchant.save()
//         const token = await merchant.generateAuthToken()
//         res.status(201).send( {merchant, token} )
//     } catch (e) {
//         res.status(400).send()
//     }
// })

//1.Create new ADMIN Merchant or Merchant...????
router.post('/merchants', async(req, res) => {
    const merchant = new Merchant(req.body)

    try {
        await merchant.save()
        const token = await merchant.generateAuthToken()
        res.status(201).send( {merchant, token} )
    } catch (e) {
        res.status(400).send()
    }
})

//2.Merchant Login
router.post('/merchants/login', async(req, res) => {
    try {
        const merchant = await Merchant.findByCredentials(req.body.email, req.body.password)
        const token = await merchant.generateAuthToken()
        res.send( {merchant, token} )
    } catch (e) {
        res.status(400).send()
    }
})


//3.Merchant Logout
router.post('/merchants/logout', authMerch, async(req, res) => {
    try {
        req.merchant.tokens = req.merchant.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.merchant.save()
        
        res.send('Merchant succesfully logged out from this device')
    } catch (e) {
        res.status(500).send()
    }
})

//4.Merchant LogoutAll
router.post('/merchants/logoutAll', authMerch, async(req, res) => {
    try {
        req.merchant.tokens = []
        await req.merchant.save()
        res.send('Merchant successfully logged out from all devices')
    } catch (e) {
        res.status(500).send()
    }
})

//5.Read Merchant Profile
router.get('/merchants/me', authMerch, async(req, res) => {
    res.send(req.merchant)
})

//6.Update Merchant & give description
//!!!!!!Must add mail for password or mail, +menu!!!!
router.patch('/merchants/me', authMerch, async(req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'email', 'telephone', 'city', 'street', 'number', 'postalCode', 'menu']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({Error: 'invalid updates'})
    }

    try {
        updates.forEach((update) => req.merchant[update] = req.body[update])
        await req.merchant.save()
        res.send(req.merchant)
    } catch (e) {
        res.status(500).send()
    }
})

//7.Delete Merchant Profile
router.delete('/merchants/me', authMerch, async(req, res) => {
    try {

        //.remove() depreciated in Mongoose v7.0
        // await req.merchant.remove()

        await req.merchant.deleteOne()
        // sendCancelationEmail(req.merchant.email, req.merchant.name)
        res.send(req.merchant)
    } catch (e) {
        res.status(500).send(e) 
    }
})

//middleware for file uploads through npm-multer
const upload = multer({
    limits: {
        filesize: 1000000
    },
    filefilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {

            return cb(new Error('Please upload file which is .jpg, .jpeg or .png'))
        }

        cb(undefined, true)
    }
})

//8. Create Merchant Avatar
router.post('/merchants/me/avatar', authMerch, upload.single('avatar'), async(req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    req.merchant.avatar = buffer
    await req.merchant.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send( {error: error.message} )
})

//9.Read Merchant Avatar
router.get('/merchants/:id/avatar', async(req, res) => {
    try {
        const merchant = await Merchant.findById(req.params.id)

        if (!merchant || !merchant.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(merchant.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

//10.Delete Avatar
router.delete('/merchants/me/avatar', authMerch, async(req, res) => {
    if (!req.merchant.avatar) {
        res.status(400).send('No avatar to delete!')
    }
    
    try {
        req.merchant.avatar = undefined
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router