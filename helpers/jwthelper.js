const jwt = require('jsonwebtoken');
const creatErrors = require('http-errors');

module.exports = {
    signAccessToken : (userid)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
                name:"aazim",
            //     aud
            //     exp:
                //  iss:"abc.com"
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn:"1h", 
                issuer:"help.com",
                audience: userid
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err){
                    reject(creatErrors.InternalServerError())
                }
                resolve(token);
            })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if(!req.headers['authorization'])return next(creatErrors.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if(err) {
                const message = err.name ==='JsonWebTokenError'?'Unauthorized' : err.message;
                next(creatErrors.Unauthorized(message));
               
            }
            req.payload = payload;
            next();
        })
    },
    signRefreshToken : (userid)=>{
        return new Promise((resolve,reject)=>{
            const payload = {
                name:"aazim",
            //     aud
            //     exp:
                //  iss:"abc.com"
            }
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn:"5h", 
                issuer:"help.com",
                audience: userid
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err){
                    reject(creatErrors.InternalServerError())
                }
                resolve(token);
            })
        })
    }
    /*,
    verifyRefreshToken:(req,res,next)=>{
        if(!req.headers['authorization'])return next(creatErrors.Unauthorized());
        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
            if(err) {
                const message = err.name ==='JsonWebTokenError'?'Unauthorized' : err.message;
                next(creatErrors.Unauthorized(message));
               
            }
            req.payload = payload;
            next();
        })
    } */
}