const express = require("express");
const userController = require("../controller/userController");

const authController = require("../controller/authController");
const router = express.Router();




router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/upadteMyPassword",authController.protect, authController.updateMyPassword);


router.patch("/updateMe",authController.protect, userController.updateMe);

router.delete("/deleteMe",authController.protect, userController.deleteMe);

router.route("/").get(userController.getAllUsers).post(userController.createNewUser);

router.route("/:id").get(userController.getSpecificUser).patch(userController.updateUser).delete(userController.deleteUser);

module.exports = router;
