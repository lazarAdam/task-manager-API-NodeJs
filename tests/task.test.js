const request = require('supertest')
const Task = require('../src/models/task')
const app = require('../src/app')
const {userOneID,userOne,populateDbForTest} = require('./fixtures/db')




/**
 *this will run before running each of tests down bellow,
 *  here we use it to wipe out the database clean before starting tests and create a new set of data
//  */
beforeEach(populateDbForTest)


test('should create task user', async ()=>{

    const resp = await request(app)
        .post('/task')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            desc:'from my test'
        })
        .expect(200)

})