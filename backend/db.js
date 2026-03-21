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

const User= mongoose.model("User",userSchema);
module.exports = {
    User

}
;