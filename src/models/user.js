const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require("./task")




/**
 *
 * Schema definition used for the User model
 */
const userSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            default: 0,
            validate: function (value) {
                if (value < 0) {
                    throw new Error('age must be a positive number')
                }
            }
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate: function (value) {
                if (!validator.isEmail(value)) {
                    throw new Error('email is not valid!')
                }
            }
        },
        password: {
            type: String,
            required: true,
            minLength: 7,
            trim: true,
            validate: function (value) {

                if (value.toLowerCase().includes('password')) {
                    throw new Error('Password cannot contain word\' password\'')
                }
            }

        },

        tokens: [{
            token: {
                type: String,
                required: true,
            }
        }],
        avatar: {
            type: Buffer
        }


    }, {
        timestamps: true
    }
)


/**
 * Register a custom User instance  method for the User model
 * which is a accessed via a User model instance
 */

userSchema.methods.generateAuthToken = async function () {

    const user = this

    const token = jwt.sign({_id: user._id.toString()}, 'NodeCourse2021')

    user.tokens.push({token: token})

    await user.save()

    return token

}

// this instance method returns a filtered user object wihout the tokens array and hashed password
userSchema.methods.getPublicProfile = function () {

    const user = this

    // assign the current user to a new variable
    const userObject = user.toObject()


    // modify the object by deleting the tokens array and password
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject

}

/**
 * virtual attributes allows to add properties that are not saved to db
 * with this, a relationship can be created between two collections just like relational databases. This done by using:
 * ref and the name of the  foreign collection also note that ref field must exist in the other collection
 * localField is the field used to associate between two collections, here it is the _id of a user
 * foreignField is the same filed as the local field but it is the one that exist in the other collection which is Task
 */
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})


/**
 * Register a custom static login method for the User model
 */

userSchema.statics.fidByCredentials = async (email, password) => {

    const user = await User.findOne({email: email})


    if (!user) {
        throw new Error('unable to login !')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {

        throw new Error('unable to login')
    }

    return user
}


/**
 * Middleware for the user model
 * pre() execute the code in the passed async function just before mongoose access the save() for the current instance of
 * the User model save() applies  changes to the db
 *
 * next argument allows code to continue execution after this middleware finished its work
 *
 */

userSchema.pre('save', async function (next) {

    const user = this

    // check if the current instance of user has a different value of password other than the original one in the db
    if (user.isModified('password')) {

        const salt = await bcrypt.genSalt(8)

        user.password = await bcrypt.hash(user.password, salt)
    }

    console.log('just before saving')

    next()
})


// middleware for delete all tasks of a user before deleting a user profile
userSchema.pre('remove', async function (next) {

    const user = this

    await Task.deleteMany({owner: user._id})

    next()

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

const User = mongoose.model('user', userSchema)

module.exports = User