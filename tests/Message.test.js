let mongoose = require("mongoose");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
var assert = require("chai").assert;
const User = mongoose.model("User");
const Group = mongoose.model("Group");
const Message = mongoose.model("Message");

chai.use(chaiHttp);
let adminUserId, normalUserId, groupId, messageId;
describe("User", () => {
  before(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
  });
  after(async () => {
    await User.deleteMany({});
    await Group.deleteMany({});
  });
  it("Register a User", (done) => {
    try {
      const user = { userName: "TestUser1", password: "Test123@" };
      chai
        .request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.isNotNull(res.userId);
          normalUserId = res.body.userId;
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Register a Admin User for the group: group creator", (done) => {
    try {
      const user = {
        userName: "TestUser2",
        password: "Test123@",
      };
      chai
        .request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.isNotNull(res.userId);
          adminUserId = res.body.userId;
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should create a group", (done) => {
    try {
      const name = { name: "TestGroup", currentUserId: adminUserId };
      chai
        .request(server)
        .post("/group/create")
        .set("cookies", { sads: "dada" })
        .send(name)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isNotNull(res.body.groupId);
          groupId = res.body.groupId;
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should add a member to group if user is Admin", (done) => {
    try {
      const body = {
        members: [{ userId: normalUserId, role: "" }],
        groupId,
        currentUserId: adminUserId,
      };
      chai
        .request(server)
        .post("/group/addMember")
        .send(body)
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.equal(res.body, "Member added successfully");
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should send a message to the group", (done) => {
    try {
      const body = {
        text: "Hello",
        groupId,
        currentUserId: normalUserId,
      };
      chai
        .request(server)
        .post("/message/create")
        .send(body)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isNotNull(res.body.messageId);
          messageId = res.body.messageId;
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should like a message in the group", (done) => {
    try {
      const body = { messageId, currentUserId: normalUserId };
      chai
        .request(server)
        .post("/message/like")
        .send(body)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, `Message liked`);
          done();
        });
    } catch (e) {
      done();
    }
  });
});
