"use strict";
const mongoose = require("mongoose");
const bcrypt = require ("bcrypt");

const SALT_WORK_FACTOR = 10;

const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", function (next) {
  const user = this;

  // only hash the password if it has been modified
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


module.exports = mongoose.model("User",UserSchema);
