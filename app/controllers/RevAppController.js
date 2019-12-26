const express = require('express')
const router = express.Router() 
const { Revapp } = require('../models/Revapp')
const { authenticateRevAppliance } = require('../middlewares/authentication')

// localhost:3000/users/register
router.post('/register-appliance', function(req, res){
    const body = req.body 
    const revapp = new Revapp(body)
    revapp.save()
        .then(function(revapp){
            res.send(revapp)
        }) 
        .catch(function(err){
            res.send(err)
        }) 
})

// localhost:3000/users/login 
router.post('/Rev-appliance-login', function(req, res){
    const body = req.body 
    Revapp.findByCredentials(body.email, body.password)
        .then(function(revapp){
           return revapp.generateToken()
        })
        .then(function(token){
            res.setHeader('x-auth', token).send({})
        })
        .catch(function(err){
            res.send(err)
        })

})

// localhost:3000/users/account 
router.get('/status',  authenticateRevAppliance, function(req, res){
    const { revapp } = req 
    res.send(revapp)
})


// localhost:3000/users/logout
router.delete('/logout', authenticateRevAppliance, function(req, res){
    const { revapp, token } = req 
    User.findByIdAndUpdate(revapp._id, { $pull: { tokens: { token: token }}})
        .then(function(){
            res.send({notice: 'successfully logged out'})
        })
        .catch(function(err){
            res.send(err)
        })
})

module.exports = {
    revappliancesRouter: router
}
