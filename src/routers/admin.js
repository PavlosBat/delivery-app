const express = require('express')
const multer = require('multer')

const Admin = require('../models/admin')
// const Merchant = require('../models/merchant')
const authAdmin = require('../middleware/authAdmin')
const router = new express.Router()

//1. Create new ADMIN (Merchant, User)
router.post('/admins', async(req, res) => {
    const admin = new Admin(req.body)

    try {
        await admin.save()
        const token = await admin.generateAuthToken()
        res.status(201).send( {admin, token} )
    } catch (e) {
        res.status(400).send()
    }
})

//2. Admin Login
router.post('/admins/login', async(req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send( {admin, token} )
    } catch (e) {
        res.status(400).send()
    }
})

//3.Admin Logout
router.post('/admins/logout', authAdmin, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
    })
    await req.admin.save()

    res.send('Admin successfully logged out from this device')
    } catch (e) {
        res.status(500).send()
    }
})

//4. Admin LogoutAll
router.post('/admins/logoutAll', authAdmin, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.send('Admin successfully logged out from all devices')
    } catch (e) {
        res.status(500).send()
    }
})

//5. Read Admin Profile  ???and Merch
router.get('/admins/me', authAdmin, async(req, res) => {
    res.send(req.admin)
})

// ##.Delete Admin Profile
router.delete('/admins/me', authAdmin, async(req, res) => {
    try { 
        const admin = req.admin
        if (!admin) {
            return res.status(404).send({ error: "Admin not found"})
        }
        await admin.remove()
        // sendCancelationEmail(req.admin.email, req.admin.name)
        res.send({message: "Admin deleted successfully"})
    } catch (e) {
        res.status(500).send(e)     
    }
})

module.exports = router