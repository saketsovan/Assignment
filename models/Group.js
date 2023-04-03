const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: {
    type: [{ userId: mongoose.Schema.Types.ObjectId, role: String }],
    ref: "User",
  },
});

module.exports = mongoose.model("Group", GroupSchema);
