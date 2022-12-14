const redis = require('redis');
const client = redis.createClient({
    port:6379,
    host:'127.0.0.1'
});
client.connect();
client.on('connect',()=>{
    console.log('Connect to redis db');
});
client.on('ready',()=>{
    console.log('client connected to redis and ready to use');
});
client.on('error',(err)=>{
    console.log('Error occured in redis db ');
});
client.on('end',()=>{
    console.log('client is disconnected from redis');
});

process.on('SIGINT',async ()=>{
    await client.quit();
});
console.log();
module.exports = client