const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: "Message is required",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Group",
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Message", MessageSchema);
