const express = require("express");
const router = express.Router();

const {
  getUser,
  loginUser,
  registerUser,
  logoutUser
} = require("../controller/account");

router.get("/", getUser);
router.post('/login', loginUser);
router.post('/register', registerUser);
router.post('/logout', logoutUser);

module.exports = router;