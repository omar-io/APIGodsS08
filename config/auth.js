const secret = require('./secret');
const { expressjwt } = require('express-jwt');


//Bearer <JWT>
function getTokenFromHeader(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] == 'Bearer') {
        return req.headers.authorization.split(' ')[1]
    }
}

const auth = {
    required: function(req, res, next){
        if(!req.auth || !req.auth.user) {
            return res.sendStatus(401);
        }
        next();
    },
    isAdmin: function(req, res, next) {
        if(!req.auth) {
            return res.sendStatus(401);
        }
        if(req.auth.user !== 'admin') {
            return res.sendStatus(403);
        }
        next();
    },
    isPremium: function(req, res, next) {
        if(req.auth.isPremium) {
            next();
        }
        else {
            return res.sendStatus(403);
        }
    },
    optional: expressjwt({
        credentialsRequired: false,
        secret: secret,
        algorithms: ['HS256'],
        userProperty: 'user',
        getToken: getTokenFromHeader
    })
}

module.exports = auth;