const { expressjwt: jwt } = require("express-jwt")



function authJwt(){
    let secret = process.env.SEC_TOK;
    const api = process.env.API_URL;
    return jwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    })
    .unless({
        path: [
            {url: /\/api\/s1\/products(.*)/, methods: ['GET', 'OPTIONS']},
            {url: /\/api\/s1\/categories(.*)/, methods: ['GET', 'OPTIONS']},
            `${api}/users/register`,
            `${api}/users/login`
        ]
    })
   
}

async function isRevoked(req, token){
    if(token.payload.isAdmin == false) {
       return true;
    }
    return false;
}

module.exports = authJwt;