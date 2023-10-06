const { signup, login, allUsers, update } = require("../controllers/userControllers");

const router = require("express").Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/allUser", allUsers);
router.patch("/update", update);

module.exports = router;