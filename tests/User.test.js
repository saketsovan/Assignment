let mongoose = require("mongoose");
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
var assert = require("chai").assert;
const User = mongoose.model("User");

chai.use(chaiHttp);

describe("User", () => {
  before(async () => {
    await User.deleteMany({});
  });
  after(async () => {
    await User.deleteMany({});
  });
  it("Should not register a user with invalid password", (done) => {
    try {
      const user = { userName: "TestUser", password: "test" };
      chai
        .request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(
            res.body,
            "Invalid password:: Must be at least 6 characters and have at least one special character"
          );
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should  register a user with valid password", (done) => {
    try {
      const user = { userName: "TestUser", password: "Test123@" };
      chai
        .request(server)
        .post("/user/register")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.isNotNull(res.userId);
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should not login with invalid username", (done) => {
    try {
      const user = { userName: "TestUser1", password: "Test123@" };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body, "Incorrect Username/Password");
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should login with valid username/password", (done) => {
    try {
      const user = { userName: "TestUser", password: "Test123@" };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 201);
          assert.isNotNull(res.userId);
          done();
        });
    } catch (e) {
      done();
    }
  });
  it("Should not login with Invalid password", (done) => {
    try {
      const user = { userName: "TestUser", password: "Test123@11" };
      chai
        .request(server)
        .post("/user/login")
        .send(user)
        .end((err, res) => {
          assert.equal(res.status, 401);
          assert.equal(res.body, "Incorrect Password");
          done();
        });
    } catch (e) {
      done();
    }
  });
});
