const mongoose= require("mongoose");

const userSchema= new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        minLength:5,
        maxLength:30
    },
    firstname: {
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    lastname: {
        type:String,
        required:true,
        trim:true,
        maxLength:30
    },
    password: {
        type:String,
        required:true,
        unique:true,
        minLength:5,
        maxLength:30
    
},

});

const accountSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

const User= mongoose.model("User",userSchema);
const Account= mongoose.model("Account",accountSchema);
module.exports = {
    User,
    Account
}
;