const jwt = require('jsonwebtoken');
const creatErrors = require('http-errors');
const client = require('./init_redis');

const signAccessToken =  (userid)=>{
    return new Promise((resolve,reject)=>{
        const payload = {
            name:"aazim",
        //     aud
        //     exp:
            //  iss:"abc.com"
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const options = {
            expiresIn:"5m", 
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
const verifyAccessToken = (req,res,next)=>{
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
}

const signRefreshToken = (userid)=>{
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
        jwt.sign(payload,secret,options,async (err,token)=>{
            if(err){
                reject(creatErrors.InternalServerError())
            }else{
                const ress = await client.SETEX(userid,60,token);
                // client.SET(userid,token, function (err,ress){
                //     console.log('in .....fn');
                //     if(err){
                //         console.log('in error loop');
                //       reject(creatErrors.InternalServerError());
                //         return
                //     }else{
                //         console.log('in fn');
                //         resolve(token);
                //     }                        
                // })
                console.log('ress is', ress);
                if(ress){
                    resolve(token);
                }else{
                    console.log('Unauthorized');
                    reject(creatErrors.Unauthorized())
                    return
                }
            }
        })
    })
}

const verifyRefreshToken = (reqToken)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(reqToken,process.env.REFRESH_TOKEN_SECRET,async (err,payload)=>{
            if(err){
                reject(creatErrors.BadRequest())
            }
            const userId = payload.aud;
            const uiddd = await client.GET(userId);
            if(uiddd){
                resolve(userId);
            }
            else{
                reject(creatErrors.Unauthorized())
            }
            // client.GET(userId,(err,val)=>{
            //     if(err){
            //         reject(creatErrors.InternalServerError())
            //         return
            //     }
            //     if(reqToken === val) resolve(userId)
            //     reject(creatErrors.Unauthorized());
            // })

            // resolve(userId)
        })
    });
        
} 
module.exports = { signAccessToken,signRefreshToken,verifyAccessToken,verifyRefreshToken
    // signAccessToken : (userid)=>{
    //     return new Promise((resolve,reject)=>{
    //         const payload = {
    //             name:"aazim",
    //         //     aud
    //         //     exp:
    //             //  iss:"abc.com"
    //         }
    //         const secret = process.env.ACCESS_TOKEN_SECRET;
    //         const options = {
    //             expiresIn:"5m", 
    //             issuer:"help.com",
    //             audience: userid
    //         }
    //         jwt.sign(payload,secret,options,(err,token)=>{
    //             if(err){
    //                 reject(creatErrors.InternalServerError())
    //             }
    //             resolve(token);
    //         })
    //     })
    // },
    // verifyAccessToken:(req,res,next)=>{
    //     if(!req.headers['authorization'])return next(creatErrors.Unauthorized());
    //     const authHeader = req.headers['authorization'];
    //     const bearerToken = authHeader.split(' ');
    //     const token = bearerToken[1];
    //     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
    //         if(err) {
    //             const message = err.name ==='JsonWebTokenError'?'Unauthorized' : err.message;
    //             next(creatErrors.Unauthorized(message));
               
    //         }
    //         req.payload = payload;
    //         next();
    //     })
    // },
    // signRefreshToken : (userid)=>{
    //     return new Promise((resolve,reject)=>{
    //         const payload = {
    //             name:"aazim",
    //         //     aud
    //         //     exp:
    //             //  iss:"abc.com"
    //         }
    //         const secret = process.env.REFRESH_TOKEN_SECRET;
    //         const options = {
    //             expiresIn:"5h", 
    //             issuer:"help.com",
    //             audience: userid
    //         }
    //         jwt.sign(payload,secret,options,async (err,token)=>{
    //             if(err){
    //                 reject(creatErrors.InternalServerError())
    //             }else{
    //                 const ress = await client.SETEX(userid,6000,token);
    //                 // client.SET(userid,token, function (err,ress){
    //                 //     console.log('in .....fn');
    //                 //     if(err){
    //                 //         console.log('in error loop');
    //                 //       reject(creatErrors.InternalServerError());
    //                 //         return
    //                 //     }else{
    //                 //         console.log('in fn');
    //                 //         resolve(token);
    //                 //     }                        
    //                 // })
    //                 console.log(ress);
    //                 if(ress === "OK"){
    //                     resolve(token);
    //                 }
    //             }
    //         })
    //     })
    // },
    // verifyRefreshToken:(reqToken)=>{
    //     return new Promise((resolve,reject)=>{
    //         jwt.verify(reqToken,process.env.REFRESH_TOKEN_SECRET,async (err,payload)=>{
    //             if(err){
    //                 reject(creatErrors.BadRequest())
    //             }
    //             const userId = payload.aud;
    //             const uiddd = await client.GET(userId);
    //             if(uiddd){
    //                 resolve(userId);
    //             }
    //             // client.GET(userId,(err,val)=>{
    //             //     if(err){
    //             //         reject(creatErrors.InternalServerError())
    //             //         return
    //             //     }
    //             //     if(reqToken === val) resolve(userId)
    //             //     reject(creatErrors.Unauthorized());
    //             // })

    //             // resolve(userId)
    //         })
    //     });
            
    // } 

}
