var express = require("express");
var cookieParser = require("cookie-parser");

var app = express()

app.get("/",(req,res)=>{
    res.cookie("username","himanshu")
    res.send("hello")
})

app.listen(4000,()=>{})