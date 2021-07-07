require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('60dd092ef8c5236388877305', {age: 1})
    .then(user => {
        console.log(user)
        return User.countDocuments({age: 1})
    })
    .then(result => {
        console.log(result)
    }).catch(e => {
    console.log(e)
})


/**
 * Using promise chaining with async/await syntax
 */
const updateAgeAndCount = async (id, age) => {

    const user = await User.findByIdAndUpdate(id, {age: age})
    const count = await User.countDocuments({age: age})

    return count
}

updateAgeAndCount('60dd08c9b0c88d57f43b7ae8', 2)
    .then(count => {
        console.log(count)
    }).catch(e => {
    console.log('e', e)
})