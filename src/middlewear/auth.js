const jwt = require('jsonwebtoken')
const User = require('../models/user')

/**
 * Auth middleware function  which runs first before any routes that is added to
 */
const auth = async (req, res, next) => {
    try {

        // get the token from the request header Authorization and trim the word Berarer
        const token = req.header("Authorization").replace('Bearer ', "")

        // verify if the token is valid
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // use the decoded token which contains the user id and use the token value in the headed to fetch
        // the user from the database with that token if it exist
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        // if no user was found throw an error
        if (!user) {
            throw new Error()
        } else {
            // set the a user object in the request to the returned user
            req.user = user
            req.token = token
            next()
        }


    } catch (e) {
        console.log(e)
        res.status(401).send({error: "please authenticate"})
    }

}

module.exports = auth