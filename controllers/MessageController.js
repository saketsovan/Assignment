const mongoose = require("mongoose");
const Message = mongoose.model("Message");

exports.createMessage = async (req, res) => {
  try {
    const { text, groupId } = req.body;

    const newMessage = new Message({
      message: text,
      userId: req.body.currentUserId,
      groupId,
    });
    await newMessage.save();
    res
      .status(200)
      .json({messageId: newMessage});
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.likeMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const messageDetails = await Message.findOne({ _id: messageId });
    if (messageDetails == null) {
      res.status(404).json("Message not found");
      return;
    }
    Message.updateOne({ _id: messageId }, { $push: { likes: req.body.currentUserId } });
    res.status(200).json(`Message liked`);
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};
