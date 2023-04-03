const mongoose = require("mongoose");
const Group = mongoose.model("Group");

exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    members = req.body.members ?? [];
    //creator of the group becomes the admin byDefault
    members = [{ userId: req.userId, role: "Admin" }, ...members];
    const newUser = new Group({ name, members });
    await newUser.save();
    res.status(200).json(`Group created successfully: GroupId:${newUser._id}`);
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const id = req.body.id;
    const groupDetails = await Group.findOne({ _id: id });
    if (groupDetails == null) {
      res.status(404).json("Group not found");
      return;
    }
    const role = groupDetails.members.find((userId) => req.userId)?.role;
    //only Admin can delete the group
    if (role === "Admin") {
      await Group.deleteOne({ _id: id });
      res.status(200).json("Group deleted successfully");
    } else {
      res.status(401).json("Only Admins can delete");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.addMember = async (req, res) => {
  try {
    const { members, groupId } = req.body;
    const groupDetails = await Group.findOne({ _id: id });
    if (groupDetails == null) {
      res.status(404).json("Group not found");
      return;
    }
    const role = groupDetails.members.find((userId) => req.userId)?.role;
    //only Admin can add member in the group
    if (role === "Admin") {
      Group.updateOne(
        { _id: groupId },
        { $push: { members: { $each: members } } }
      );
      res.status(201).json("Member added successfully");
    } else {
      res.status(401).json("Only Admins can add members");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json("Error");
  }
};

exports.searchGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const groupDetails = await Group.findOne({ _id: id });
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
