let mongoose = require("mongoose");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
var assert = require("chai").assert;
const User = mongoose.model("User");
const Group = mongoose.model("Group");

chai.use(chaiHttp);
let adminUserId, normalUserId, groupId;
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
  it("Should not add a member to group", (done) => {
    try {
      const body = {
        members: [{ userId: normalUserId, role: "" }],
        groupId,
        currentUserId: normalUserId,
      };
      chai
        .request(server)
        .post("/group/addMember")
        .send(body)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body, "Only Admins can add members");
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
  it("Don't delete the group, if user is not admin", (done) => {
    try {
      const groupId = { groupId,currentUserId: normalUserId };
      chai
        .request(server)
        .post("/group/delete")
        .send(groupId)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body, "Only Admins can delete Group");
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Delete the group, if user is admin", (done) => {
    try {
      const groupId = { groupId,currentUserId: adminUserId };
      chai
        .request(server)
        .post("/group/delete")
        .send(groupId)
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, "Group deleted successfully");
          done();
        });
    } catch (e) {
      done();
    }
  });
});
