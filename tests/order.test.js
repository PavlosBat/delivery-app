const request = require('supertest')
const app = require('../src/app')
const { Order } = require('../src/models/merchant')
const { orderOneId, orderOne, orderTwoId, orderTwo, orderThreeId, orderThree,  setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a new order', async () => {})
