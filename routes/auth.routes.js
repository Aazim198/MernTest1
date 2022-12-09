const express = require('express');
const createErrors = require('http-errors');
const User = require('../models/user.model');
const {authSchema} = require('../helpers/validationSchema');
const {signAccessToken,signRefreshToken} = require('../helpers/jwthelper');


const router = express.Router();

router.post('/register',async(req,res,next)=>{
    try {
        // const {email,password} = await req.body;

        const result = await authSchema.validateAsync(req.body);
        // if(!email || !password) throw createErrors.BadRequest();
        const emailAlreadyRegistered = await User.findOne({email:result.email});
        if(emailAlreadyRegistered){
            throw createErrors.Conflict(`${result.email} is already registered`);
        }
        const newUser = new User(result);
        const savedUser = await newUser.save();
        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);
        res.send({
            status:201,
            access_token:accessToken,
            refresh_token:refreshToken
        })
    } catch (error) {
        if(error.isJoi ===true)error.status=422
        next(error)
    } finally{
        console.log('function ended');
    }
})
router.post('/login',async(req,res,next)=>{
    try {
        const result = await authSchema.validateAsync(req.body);
        const user_log = await User.findOne({email: result.email});

        if(!user_log) throw createErrors.NotFound(`No user found with email: ${result.email}`)
        const isMatch = await user_log.isValidPwd(result.password);

        if(!isMatch) throw createErrors.Unauthorized('Password is invalid');
        const accessToken = await signAccessToken(user_log.id)
        const refreshToken = await signRefreshToken(user_log.id)
        res.send({accessToken, refreshToken});
    } catch (error) {
        if(error.isJoi ===true) return next(createErrors.BadRequest("invalid email or password"))
                next(error);
    }
})
router.post('/refresh-token',async(req,res)=>{
    res.send('TOken route');
})
router.delete('/logout',async(req,res)=>{
    res.send('Log out route');
})
module.exports = router;