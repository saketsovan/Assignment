const mongoose = require("mongoose");
const Message = mongoose.model("Message");

exports.createMessage = async (req, res) => {
  try {
    const { text, groupId } = req.body;

    const newMessage = new Message({
      message: text,
      userId: req.userId,
      groupId,
    });
    await newMessage.save();
    res
      .status(200)
      .json(`Message created successfully: messageId:${newMessage._id}`);
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.likeMessage = async (req, res) => {
  try {
    const { messageId } = req.body;
    const messageDetails = await Group.findOne({ _id: messageId });
    if (messageDetails == null) {
      res.status(404).json("Message not found");
      return;
    }
    Group.updateOne({ _id: messageId }, { $push: { likes: req.userId } });
    res.status(200).json(`Message liked`);
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};
