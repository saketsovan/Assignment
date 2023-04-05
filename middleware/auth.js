const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  //skip authentication for test
  if(process.env.NODE_ENV=="Test"){
    return next();
  }
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    jwt.verify(token, jwtSecret, {}, (err, payload) => {
      if (err) {
        console.log(err);
        throw err;
      }
      req.body.currentUserId = payload.userId;
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
