function errorCatch(err, req,res, next){
    if(err.name === 'UnauthorizedError'){
       return res.status(401).json({message: 'user not authorized'})
    }
    if(err.name === 'ValidationError'){
       return res.status(401).json({message: 'The  user is not authorized '})
    }
    return res.status(500).json(err)
}

module.exports = errorCatch; 