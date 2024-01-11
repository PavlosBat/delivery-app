const request = require('supertest')
const app = require('../src/app')
const { Merchant } = require('../src/models/merchant')
const { merchantOneId, merchantOne, merchantTwoId, merchantTwo, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new merchant', async () => {})

