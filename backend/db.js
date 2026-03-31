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
        minLength:5,
        
    
},

});

const accountSchema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

const scheduledPaymentSchema= new mongoose.Schema({

  fromUserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
,
  toUserId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
,
    amount: Number,
    executeAt: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum:["pending","success","failed","cancelled"],
        default:"pending"
    }
},{ timestamps: true });

const User= mongoose.model("User",userSchema);
const Account= mongoose.model("Account",accountSchema);
const ScheduledPayment = mongoose.model("ScheduledPayment",scheduledPaymentSchema);
module.exports = {
    User,
    Account,
    ScheduledPayment
}
;