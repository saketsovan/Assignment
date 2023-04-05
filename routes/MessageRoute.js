const router = require("express").Router();
const auth = require("../middleware/auth");
const messageController = require("../controllers/MessageController");

router.post("/create", auth, messageController.createMessage);
router.post("/like", auth, messageController.likeMessage);

module.exports = router;