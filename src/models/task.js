const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({

    desc: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        required: false,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref references another collection from the db by just providing the name of the collection
        ref: 'User'

    }


}, {
    timestamps:true
})


/**
 *
 * mongoose.model defines a model that can be used as blueprint to create documents in  collections of mongodb
 * name: stands for the name of the collection where the new user will be created in mongodb
 * mongodb will create a collection if the name of the specified one doesn't exist in the database
 *
 * schema: contains all the type definitions, validation definition of each properties that makes up a single entry
 * in the collection
 */
const Task = mongoose.model('Task', taskSchema)

module.exports = Task