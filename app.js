"use strict";
const express = require("express");
const cookieParser = require("cookie-parser");
const userRoute = require("./routes/UserRoute");
const groupRoute = require("./routes/GroupRoute");

const app= express();
console.log("reached");
app.use(express. json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/user",userRoute);
app.use("/group",groupRoute);

module.exports=app;
