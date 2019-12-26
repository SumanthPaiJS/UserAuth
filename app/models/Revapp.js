const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const Schema = mongoose.Schema

const revappSchema = new Schema({
    username: {
        type: String, 
        required: true, 
        unique: true, 
        minlength: 5
    }, 
    appliancecode:{
        type:String,
        required:true,
        unique:true
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
        validate: {
            validator: function(value){
                return validator.isEmail(value)
            },
            message: function(){
                return 'invalid email format'
            }
        }
    },
    password: {
        type: String,
        required: true, 
        minlength: 6,
        maxlength: 128 
    }, 
    tokens: [
        {
            token: {
                type: String
            }, 
            createdAt: {
                type: Date, 
                default: Date.now
            }
        }
    ]
})


// own static method 
revappSchema.statics.findByCredentials = function(email, password){
    const Revapp = this 
    return User.findOne({ email })
                .then(function(revapp){
                    if(!revapp) {
                        return Promise.reject('invalid email / password')
                    }

                    return bcryptjs.compare(password, revapp.password)
                                .then(function(result){
                                    if(result) {
                                        return Promise.resolve(user)
                                        // return new Promise(function(resolve, reject){
                                        //     resolve(user)
                                        // })
                                    } else {
                                        return Promise.reject('invalid email / password ')
                                    }
                                })
                })
                .catch(function(err){
                    return Promise.reject(err)
                    // return new Promise(function(resolve, reject){
                    //  reject(err) 
                    // })
                })
}

revappSchema.statics.findByToken = function(token){
    const Revapp = this
    let tokenData 
    try {
        tokenData = jwt.verify(token, 'scanrev@123')
    } catch(err){
        return Promise.reject(err)
    }

    return Revapp.findOne({
        _id: tokenData._id, 
        'tokens.token': token
    })
}

// own instance methods
revappSchema.methods.generateToken = function(){
    const revapp = this 
    const tokenData = {
        _id: revapp._id, 
        username: revapp.username, 
        createdAt: Number(new Date())
    }

    const token = jwt.sign(tokenData, 'scanrev@123')
    revapp.tokens.push({
        token
    })

    return revapp.save()
        .then(function(user){
            return Promise.resolve(token)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}



// pre hooks - Model Middlewares - 
revappSchema.pre('save', function (next) {
    const revapp = this
    if(revapp.isNew) {
        bcryptjs.genSalt(10)
            .then(function (salt) {
                bcryptjs.hash(revapp.password, salt)
                    .then(function (encryptedPassword) {
                        revapp.password = encryptedPassword
                        next()
                    })
            })
    } else {
        next()
    }
})

const Revapp = mongoose.model('Revapp', revappSchema)


module.exports = {
    Revapp
}