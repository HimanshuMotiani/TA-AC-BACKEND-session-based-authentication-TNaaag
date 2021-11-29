var mongoose = require("mongoose");
var bcrypt = require("bcrypt")
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String, minlength: 5 },
    age: Number,
    phone: { type: Number, maxlength: 10 }
}, { timestamps: true })

userSchema.pre("save", function (next) {
    if (this.password && this.isModified('password')) {
        bcrypt.hash(this.password, 10, (err, hased) => {
            if (err) return next(err);
            this.password = hased;
            return next()
        })
    }
    else {
        next()
}
})

userSchema.methods.verifyPassword = function(password,cb){
    console.log(cb);
    bcrypt.compare(password,this.password,(err,result)=>{ //this.password = hased pass, password = coming from form
        return cb(err,result)
    })
}

var User = mongoose.model("User", userSchema)

module.exports = User;