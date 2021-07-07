const mongoose = require('mongoose')


// connect to mongodb server using task-manager-api db
mongoose.connect(process.env.MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify:false
})



// const me = new User({
//     name: '    lazar   ',
//     email:'MYEMAIL@GMAIL.COM',
//     password:'        Pxxae123      ',
//
// })
//
//
//
// me.save()
//     .then(() => {
//         console.log(me)
//     })
//     .catch(error => {
//         console.log('Error logging:', error)
//
//     })

// const Tasks = mongoose.model('Task', {
//
//     desc: {
//
//         type: String,
//         required: true,
//         trim:true
//     },
//     completed: {
//         type: Boolean,
//         required:false,
//         default:false,
//     }
//
// })
//
//
// const taskOne = new Tasks({
//     desc: 'shopping',
// })
//
// taskOne.save()
//     .then(res => {
//         console.log(res)
//     })
//     .then(error => {
//         console.log(error)
//     })