const router = require("express").Router();
const adminController = require("../controllers/adminController");
const userController = require("../controllers/userController");
const { verifyUser, verifyAdmin } = require("../middleware/verifyToken");

router.post("/", adminController.signUp)

router.post("/login", adminController.logIn)

router.patch('/:userId', adminController.updateAdmin);

router.delete('/:userId', adminController.deleteAdmin); //deletar admin

router.delete('/user/:userId', userController.deleteUser); //deletar usuário

router.get("/data", verifyAdmin, adminController.data)

module.exports = router;
