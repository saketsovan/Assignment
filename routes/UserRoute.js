const router = require("express").Router();
const userController = require("../controllers/UserController");

router.post("/login", userController.login);
router.post("/register", userController.register);
router.put("/logout", userController.logout);

module.exports = router;
