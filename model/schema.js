const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const passport = require('passport')

const userSchema =  mongoose.Schema({
    email: String,
    password:String,
    secret: Array
})
userSchema.plugin(passportLocalMongoose);



const userModel = mongoose.model('user', userSchema)

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());

module.exports = userModel;

