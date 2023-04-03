const router = require("express").Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/GroupController");

router.post("/create", auth, userController.createGroup);
router.post("/delete", auth, userController.deleteGroup);
router.post("/addMember", auth, userController.addMember);
router.get("/searchGroup", auth, userController.searchGroup);

module.exports = router;
