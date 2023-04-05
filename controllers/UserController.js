"use strict";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = mongoose.model("User");
const validatePasswordFormat = require("./helper/PasswordValidator");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwtSecret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { userName, password } = req.body;
  if (!validatePasswordFormat(password)) {
    res
      .status(401)
      .json(
        "Invalid password:: Must be at least 6 characters and have at least one special character"
      );
    return;
  }

  try {
    const newUser = new User({ userName, password });
    //password gets hashed before saving to mondoDb --> handled in UserSchema
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, jwtSecret, {
      expiresIn: "2h",
    });
    res.cookie("token", token).status(201).json({ userId: newUser._id });
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const foundUser = await User.findOne({ userName });

    if (foundUser == null || password == null) {
      res.status(401).json("Incorrect Username/Password");
      return;
    }

    const isValidPassword = bcrypt.compareSync(password, foundUser.password);
    if (isValidPassword) {
      const token = jwt.sign({ userId: foundUser._id }, jwtSecret, {
        expiresIn: "2h",
      });
      res.cookie("token", token).status(201).json({ userId: foundUser._id });
    } else {
      res.status(401).json("Incorrect Password");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.logout = async (req, res) => {
  try {
    const token = jwt.sign({ userId: req.userId }, jwtSecret, { expiresIn: 1 });
    res.cookie("token", token).status(200).json("Logged out");
  } catch (e) {
    console.log(e);
    res.status(401).json("Action failed");
  }
};
