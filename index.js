const express = require('express');
const { config } = require('process');

const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;

app.get('/',(req,res)=>{
    res.send('Hello');
})
app.get('/home',(req,res)=>{
    res.send('Hello, this is homepage');
})
app.get('*',(req,res)=>{
    res.send('Page not found');
})

app.listen(PORT,()=>{
    console.log(`connected to server on port http://localhost:${PORT}`);
});