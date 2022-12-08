const express = require('express');
const createErrors = require('http-errors');
const User = require('../models/user.model');

const router = express.Router();

router.post('/register',async(req,res,next)=>{
    try {
        const {email,password} = await req.body;
        if(!email || !password) throw createErrors.BadRequest();
        const emailAlreadyRegistered = await User.findOne({email:email});
        if(emailAlreadyRegistered){
            throw createErrors.Conflict(`${email} is already registered`);
        }
        const newUser = new User({email:email,password:password});
        const savedUser = await newUser.save();
        res.send({
            status:201,
            message:savedUser
        })
    } catch (error) {
        next(error)
    } finally{
        console.log('function ended');
    }
})
router.post('/login',async(req,res)=>{
    res.send('Login route');
})
router.post('/refresh-token',async(req,res)=>{
    res.send('TOken route');
})
router.delete('/logout',async(req,res)=>{
    res.send('Log out route');
})
module.exports = router;