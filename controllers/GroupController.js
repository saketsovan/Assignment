const mongoose = require("mongoose");
const Group = mongoose.model("Group");

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    members = req.body.members ?? [];
    //creator of the group becomes the admin byDefault
    members = [{ userId: req.body.currentUserId, role: "Admin" }, ...members];
    const newGroup = await Group.insertMany({ name, members });
    console.log(newGroup[0]._id);
    res.status(200).json({ groupId: newGroup[0]._id });
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = req.body.id;
    const userId = req.body.currentUserId;
    const groupDetails = await Group.findOne({
      _id: groupId,
      members: { $elemMatch: { userId, role: "Admin" } },
    });
    if (groupDetails == null) {
      res.status(401).json("Only Admins can delete Group");
      return;
    }
    const role = groupDetails.members.find((id) => id === userId)?.role;
    await Group.deleteOne({ _id: groupId });
    res.status(200).json("Group deleted successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.addMember = async (req, res) => {
  try {
    const { members, groupId } = req.body;
    const userId = req.body.currentUserId;
    const groupDetails = await Group.findOne({
      _id: groupId,
      members: { $elemMatch: { userId, role: "Admin" } },
    });
    if (groupDetails == null) {
      res.status(401).json("Only Admins can add members");
      return;
    }
    //only Admin can add member in the group
    await Group.updateOne(
      { _id: groupId },
      { $push: { members: { $each: members } } }
    );
    res.status(201).json("Member added successfully");
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.searchGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const groupDetails = await Group.findOne({ _id: groupId });
    if (groupDetails == null) {
      res.status(404).json("Group not found");
      return;
    }
    res.status(201).json({ groupDetails: groupDetails });
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};
