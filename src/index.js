require("./db/mongoose")
const express = require('express')
const userRoutes = require('./routers/user-routes')
const tasksRoutes = require('./routers/tasks-routes')
const app = express()
const port = process.env.PORT

// set Express to parse the body of all the requests automatically to json format
app.use(express.json())


/**
 * Express routes registration
 */
app.use(userRoutes)
app.use(tasksRoutes)


app.listen(port, () => {
    console.log('server is up running and listening on port',port)
})

// const jwt = require('jsonwebtoken')
//
// const myFunction = async () => {
//
//     const token = jwt.sign({_id: 'abc123'}, 'thisismycourser',{expiresIn: '7 days'})
//
//     console.log(token)
//
//     const data = jwt.verify(token,'thisismycourser')
//
//     console.log(data)
// }
//
//
//
// myFunction().then(()=>{})



//upload.single('upload')

// test commit