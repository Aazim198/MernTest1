const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL,{dbName:'Mongodb_test_db'})
.then((dd)=>{
    console.log('Connected to db');
})
.catch((err)=>{
    console.log('Error occured', err.message);
});


mongoose.connection.on('connected',()=>{
    console.log('Mongoose db is connected');
});

mongoose.connection.on('error',()=>{
    console.log('Mongoose db is error');
});

mongoose.connection.on('disconnected',()=>{
    console.log('Mongoose db is disconnected');
});

process.on('SIGINT',async()=>{
    await mongoose.connection.close();
    process.exit(0);
})