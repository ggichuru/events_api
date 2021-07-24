const models = require('../models')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Validate = require('fastest-validator')

const dotenv = require('dotenv')
dotenv.config()


function userSignUp(req, res) {
    // check if user email exists
    models.User.findOne({ where: { email: req.body.email } }).then(result => {
        if (result) {
            res.status(409).json({
                message: 'Email already exists. Recover password or use a different email to register'
            })
        } else {

            /*
            Password hashing.
            Generate salt used to has the user inputed password. 
            Call back functions for the hash with its own CB() for user object and model definition
            */
            bcryptjs.genSalt(10, (err, salt) => {
                bcryptjs.hash(req.body.password, salt, (err, hash) => {
                    // create user object
                    const user = {
                        username: req.body.username,
                        email: req.body.email,
                        password: hash
                    }

                    const schema = {
                        username: { type: 'string', optional: 'false', max: 30 },
                        email: { optional: 'false', type: 'email' },
                        
                    }

                    // Create new validator class instance with method validate() - pass fields object and validation schema
                    const v = new Validate()
                    const validationResponse = v.validate(user, schema)

                    // if validated passes return true else return error
                    if (validationResponse != true) {
                        return res.status(400).json({
                            message: 'validation failed!',
                            errors: validationResponse
                        })
                    }


                    models.User.create(user).then(result => {
                        res.status(201).json({
                            message: "User Created",
                            user: result
                        })
                    }).catch(err => {
                        res.status(500).json({
                            message: "something went wrong",
                            error: err
                        })
                    })
                })
            })

        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong.',
            error: err
        })
    })


}

/*
 User Login with Token authentication
 Json Web Tokens used
*/
function userLogin(req, res) {
    models.User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user == null) {
            res.status(401).json({
                message: 'Invalid Credentials'
            })
        } else {
            bcryptjs.compare(req.body.password, user.password, (err, result) => {
                // gen token if result is true
                if (result) {
                    const token = jwt.sign({
                        email: user.email,
                        userId: user.id
                    }, process.env.JWTKEY, (err, token) => {
                        res.status(200).json({
                            message: 'Authentication succesful',
                            token: token
                        })
                    })
                } else {
                    res.status(401).json({
                        message: "Invalid Credentials"
                    })
                }
            })
        }
    }).catch(err => {
        res.status(500).json({
            message: 'Something went wrong',
            error: err
        })
    })
}



module.exports = {
    userSignUp: userSignUp,
    userLogin: userLogin
}