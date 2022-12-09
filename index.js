const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
require('./helpers/db.connection');
const createErrors = require('http-errors');

const AuthRoutes = require('./routes/auth.routes')
const PORT = process.env.PORT || 3000;
const {verifyAccessToken} = require('./helpers/jwthelper')
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/',verifyAccessToken,async (req,res,next)=>{
    // console.log(req.headers['authorization']);
    res.send('Hello from app');
})

app.use('/auth',AuthRoutes);

app.use(async (req,res,next)=>{
    // const error = new Error("Not found")
    // error.status = 400
    // next(error)
    next(createErrors.NotFound("Page not found"));
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message,
        }
    })
})

app.listen(PORT,()=>{
    console.log(`connected to server on port http://localhost:${PORT}`);
});