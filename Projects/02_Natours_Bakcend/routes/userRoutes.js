const express = require("express");
const {
  getAllUsers,
  createNewUser,
  getSpecificUser,
  updateUser,
  deleteUser,
  updateMe
} = require("../controller/userController");


const authController = require("../controller/authController");
const router = express.Router();




router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/upadteMyPassword",authController.protect, authController.updateMyPassword);


router.patch("/updateMe",authController.protect, updateMe);

router.route("/").get(getAllUsers).post(createNewUser);

router.route("/:id").get(getSpecificUser).patch(updateUser).delete(deleteUser);

module.exports = router;
