const express = require("express");
const router = express.Router();
const validation = require("./validation");

const userController = require("../controllers/userController")

router.get("/users/signup", userController.signUp);
router.get("/users/payment", userController.payment);
router.post("/users", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);
router.get("/users/:id", userController.show);
router.post("/users/:id/updatepremium", userController.updatePremium);
router.post("/users/:id/updatestandard", userController.updateStandard);

module.exports = router;