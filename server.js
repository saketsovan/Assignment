"use strict";
const mongoose = require("mongoose");
const dotenv = require("dotenv");
require("./models/User");
require("./models/Group");
require("./models/Message");

const app = require("./app");



dotenv.config({ path: "./config.env" });
const PORT = 8000;

if (process.env.DATABASE == null) {
  throw new Error("Database Credentials not maintained in config file");``
}

const connectionString = process.env.DATABASE;
(async function connectDatabase() {
  try {
    console.log("connection successful to DB");
    return await mongoose.connect(connectionString);
  } catch (e) {
    throw new Error(
      `${e}::Connection could not be established, please check the connection string`
    );
  }
})();

app.listen(PORT, () => {
  console.log(`Listening in port ${PORT}`);
});
