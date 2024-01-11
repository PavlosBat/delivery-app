const request = require('supertest')
const app = require('../src/app')
const { Merchant } = require('../src/models/merchant')
const { merchantOneId, merchantOne, setupDatabase } = require('./fixtures/db')