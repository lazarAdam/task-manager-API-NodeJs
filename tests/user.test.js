/***
 *
 * This is a Jest js  test suite file with tests for the task manager api endpoints
 */

const request = require('supertest')
// get the the starting point of the app which is the same as index.js without starting the server
const app = require('../src/app')

const User = require('../src/models/user')

const {userOneID,userOne,populateDbForTest} = require('./fixtures/db')




/**
 *this will run before running each of tests down bellow,
 *  here we use it to wipe out the database clean before starting tests and create a new set of data
 */
beforeEach(populateDbForTest)


// afterEach(()=>{
//     console.log('after each call')
// })

test('Should signup a new user', async () => {
    // pass the  our app instance entry point to supertest and create a test for a post requerst with some dummy data
   const response = await request(app).post('/users').send({
        name: 'adam',
        email: 'exmaple@e.com',
        password: 'mypass!aas'
    }).expect(201)

    // assert the database was changed correctly

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //assertion about the response

    expect(response.body).toMatchObject({
        user:{
            name:'adam',
            email: 'exmaple@e.com',
        }
    })

    expect(user.password).not.toBe('mypass!aas')

})


test('should login a existing user', async () => {
    const resp = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneID)

    expect(resp.body.token).toBe(user.tokens[1].token)
})


test('should fail login a none existing user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: 'worngdpasssaaxvxv'
    }).expect(400)
})

test('should get profile for user', async () => {

    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send().expect(200)
})


test('should not get profile for user', async () => {

    await request(app)
        .get('/users/me')
        .send().expect(401)
})

test('Should upload avatar image',async ()=>{

    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/2xro7llh70n21.jpg')

        const user = await User.findById(userOneID)
        expect(user.avatar).toEqual(expect.any(Buffer))
})