const request = require('supertest')
const app = require('../src/app')
const { Order } = require('../src/models/merchant')
const { orderOneId, orderOne, setupDatabase } = require('./fixtures/db')
