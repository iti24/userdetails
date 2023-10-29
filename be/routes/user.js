const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/user");
const requireAuth = require("../middleware/auth");
// const { upload } = require("../middleware/upload.js");

// router.post("/signup", upload.single("image"), signup);
router.post("/signup", signup);

router.post("/login", login);
router.get("/getAllUser", requireAuth, getUser);
router.patch("/:id", requireAuth, updateUser);
router.delete("/:id", requireAuth, deleteUser);
module.exports = router;
