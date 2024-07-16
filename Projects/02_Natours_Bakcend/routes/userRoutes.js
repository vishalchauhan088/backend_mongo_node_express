const express = require("express");
const userController = require("../controller/userController");

const authController = require("../controller/authController");
const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.get(
  "/me",
  authController.protect,
  userController.setUserID,
  userController.getMe
);
router.use(authController.protect);

router.patch(
  "/upadteMyPassword",

  authController.updateMyPassword
);

router.patch("/updateMe", userController.updateMe);

router.delete("/deleteMe", userController.deleteMe);

router.use(authController.restrictTo("admin", "lead-guide"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser);

router
  .route("/:id")
  .get(userController.getSpecificUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
