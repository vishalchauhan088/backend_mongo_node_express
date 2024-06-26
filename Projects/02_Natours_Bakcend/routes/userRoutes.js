const express = require("express");
const {
  getAllUsers,
  createNewUser,
  getSpecificUser,
  updateUser,
  deleteUser,
} = require("../controller/userController");
const authController = require("../controller/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.route("/").get(getAllUsers).post(createNewUser);

router.route("/:id").get(getSpecificUser).patch(authController.protect,updateUser).delete(deleteUser);

module.exports = router;
