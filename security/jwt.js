const { expressjwt: jwt } = require("express-jwt")


function authJwt(){
    let secret = process.env.SEC_TOK;
    return jwt({
        secret,
        algorithms: ['ES256']
    }).unless({
        path: [
            "/api/s1/users/login"
        ]
    })
   
}
module.exports = authJwt;