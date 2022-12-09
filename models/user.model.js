const { func } = require('@hapi/joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:{
        type:String,
        required:true,
        lowecase:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
});

UserSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(8);
        const hashedPassword = await bcrypt.hash(this.password,salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
})

UserSchema.methods.isValidPwd = async function(pwd){
    try {
        return await bcrypt.compare(pwd, this.password)
    } catch (error) {
        throw error;
    }
}

UserSchema.post('save', async function(next){
    try {
        console.log('in post fn');
    } catch (error) {
        next(error);
    }
})


const User = mongoose.model('User',UserSchema);
module.exports = User;