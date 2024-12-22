const router = require("express").Router();
const authService = require("./authService");
const isUserExistMW = require("../../../utils/middlewares").isUserExist;

// Category
router.put("/signin", authService.signIn);
router.post("/signup", [isUserExistMW],  authService.signup);

module.exports = router;
