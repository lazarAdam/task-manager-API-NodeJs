const express = require('express')
const multer = require("multer")
const sharp = require("sharp")
const User = require("../models/user");
const authMidllware = require('../middlewear/auth')
const {sendWelcomeEmail,sendCancelEmailL} = require('../emails/account')


// create a new router for user routes
const router = new express.Router()

// configure  multer for uploads and add a filter function
const uploads = multer(
    {
        limits: {
            fileSize: 1000000
        },
        fileFilter: function (req, file, cb) {

            if (!file.originalname.match(/\.(jpg|jpeg|png$)/)) {

                // use callback to send an error
                cb(new Error('File must be an image with extensions as .jpg,jpeg,png'))
            }

            // call the callback passing undefined for error and true for normal flow
            cb(undefined, true)

        }
    }
)


router.post('/users', async (req, res) => {

    // create a new user in the user collection and call save() which  calls mongoose to save the created
    // user in the db. user is of type User which is a mongoose model (check each model to see the details about mongoose)
    const user = new User(req.body)

    try {
        // this will kick in the pre() mongoose middleware to encrypt the password
        await user.save()

        sendWelcomeEmail(user.email,user.name)

        res.status(201).send({user: user.getPublicProfile()})

    } catch (e) {

        res.status(400).send(e)

    }

})


router.get('/users/me', authMidllware, async (req, res) => {

    res.send(req.user.getPublicProfile())
})


router.post('/users/login', async (req, res) => {

    try {

        const user = await User.fidByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()

        // send back a filtered user object  and the generated token
        res.send({
            user: user.getPublicProfile(),
            token
        })

    } catch (e) {

        res.status(400).send({error: e.message})
    }


})


router.post('/users/logout', authMidllware, async (req, res) => {

    try {

        // remove the current token sent in the request
        // authMidllware will set a User object in the request after fetching a user form db (check authMidllware)
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })

        // save the current user state to db after token deletion
        await req.user.save()

        res.send()


    } catch (e) {

        res.status(500).send()
    }


})


router.post('/users/logoutall', authMidllware, async (req, res) => {

    try {

        // similar logic in the logout except the tokens array will entirely be deleted
        req.user.tokens = []

        await req.user.save()

        res.send()


    } catch (e) {

        res.status(500).send()
    }


})


router.patch('/users/me', authMidllware, async (req, res) => {

    // this returns an array the keys of the object in the body ({key:value})
    const updates = Object.keys(req.body)

    const allowedUpdates = ['name', 'email', 'password', 'age']

    // every() tests whether all elements in the array pass the test implemented by the provided function
    // in this case all are in allowedUpdates array if only one fails the test every returns false
    const isValidOps = updates.every(item => {
        // check if item is part of allowedUpdates
        return allowedUpdates.includes(item)
    })

    if (!isValidOps) {

        return res.status(400).send({error: 'update not allowed!'})
    }

    try {

        /**
         * Notes:
         * save() must be used in order for the mongoose middleware to kickoff
         * authMidllware() will fetch and set the User Object in the request which can be accessed here
         */

        // loop over the updates array which is the extracted keys from the request body. that contains the name of
        // keys of the properties to be updated.
        //set the value of the matching keys from the object in the body to the user object
        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })

        // save which will kick in the mongoose middleware
        await req.user.save()


        res.send(req.user)

    } catch (e) {

        res.status(400).send()
    }
})

router.delete('/users/me', authMidllware, async (req, res) => {


    try {

        // const user = await User.findByIdAndDelete(req.user._id)
        //
        // if (!user) {
        //     return res.status(404).send()
        // }

        // refactored code above. remove() is a mongoose function that does the same thing as findByIdAndDelete
        // by using the current User object to delete it
        await req.user.remove()

        // send a cancel email
        sendCancelEmailL(req.user.email,req.user.name)

        res.send(req.user.getPublicProfile())

    } catch (e) {
        res.status(500).send()
    }
})


/**
 * uploads route
 */
router.post(
    '/users/me/avatar',

    // auth middleware should run first
    authMidllware,

    // use multer middleware to watch for requests that has form-data body with a value of avatar
    // and process the file data
    uploads.single('avatar'),

    // our route handler function
    async (req, resp) => {

     // mutter will add a file object to the request so we can access it, here we are using the buffer with binary data
        // also we use sharp to reformat the image and convert it to png
        const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()

        req.user.avatar = buffer

        await req.user.save()

        resp.send({message: 'file uploaded!'})
    },

    // error handling function for this route in case multer middleware throws an error
    (error, req, res, next) => {
        res.status(400).send({error: error.message})
    }
)

router.delete('/users/me/avatar', authMidllware, async (req, res) => {


    try {

        req.user.avatar = undefined

        await req.user.save()



        res.send(req.user.getPublicProfile())

    } catch (e) {
        res.status(500).send()
    }
})


router.get('/users/:id/avatar', async (req, res) => {

    try {

        // get the user by id
        const user = await User.findById(req.params.id)

        // throw an error if no user is found or the user has no avatar
        if (!user || !user.avatar) {
            throw new Error()
        }

        // set the header to send the binary data as an image so the browser can handle it properly
        res.set('Content-type', 'image/png')

        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router