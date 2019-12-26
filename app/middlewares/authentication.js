const { Revapp } = require('../models/Revapp')

const authenticateRevAppliance = function(req, res, next){
    const token = req.header('x-auth')
    Revapp.findByToken(token)
        .then(function (revapp) {
            if(revapp) {
                req.revapp = revapp
                req.token = token
                next()
            } else {
                res.status('401').send({ notice: 'token not available'})
            }
            
        })
        .catch(function (err) {
            res.status('401').send(err)
        })
}

module.exports = {
    authenticateRevAppliance
}
