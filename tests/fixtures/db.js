const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneID = new mongoose.Types.ObjectId()

const userOne = {
    _id: userOneID,
    name: 'colde',
    email: 'colde@em.com',
    password: 'waht12356!!!',
    tokens: [
        {
            token: jwt.sign(
                {_id: userOneID},
                process.env.JWT_SECRET
            )
        }
    ]
}

const populateDbForTest =  async ()=>{

    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
}

module.exports = {
    userOneID,
    userOne,
    populateDbForTest
}