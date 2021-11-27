var express = require("express");
var cookieParser = require("cookie-parser");

var app = express()

app.get("/",(req,res)=>{
   // set cookie
    res.cookie("username","himanshu")

    //access cookies
    console.log(req.cookies);
    res.send("hello")
})

app.listen(4000,()=>{})