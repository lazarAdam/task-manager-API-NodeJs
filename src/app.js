/**
 * this file is imported by the index.js but also will be run when we just want to test the app
 * notice that app.js   wont start a nodeJs server it is only for running tests
 */

require("./db/mongoose")
const express = require('express')
const userRoutes = require('./routers/user-routes')
const tasksRoutes = require('./routers/tasks-routes')

const app = express()


// set Express to parse the body of all the requests automatically to json format
app.use(express.json())


/**
 * Express routes registration
 */
app.use(userRoutes)
app.use(tasksRoutes)


module.exports = app