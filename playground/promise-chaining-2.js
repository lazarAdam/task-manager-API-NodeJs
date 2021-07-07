require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndRemove('60dccbbedbef8c25cc8da90d')
//     .then(user => {
//         console.log(user)
//         return Task.countDocuments({completed: false})
//     })
//     .then(result => {
//         console.log(result)
//     }).catch(e => {
//     console.log(e)
// })
//

const deleteTask = async (id) => {

    const task = await Task.findByIdAndRemove(id)

    const count = await Task.countDocuments({completed: false})


    return count

}


deleteTask('60dce97d75b04d09641b4178').then(count => {
    console.log(count)
}).catch(e => {
    console.log('error', e)
})