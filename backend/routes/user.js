const userController = require("../controllers/userControllers");
const middlewareControllers = require("../controllers/middlewareControllers");
const uploadCloud = require('../congfig/cloudinaryConfig'); 


const router = require("express").Router();

//get all users
router.get("/", middlewareControllers.verifyToken, userController.getAllUsers);

//delete user
router.delete("/:id", middlewareControllers.verifyTokenAndAdminAuth, userController.deleteUser);

//update user profile
router.put("/update-profile/:id", middlewareControllers.verifyToken, uploadCloud.single('picture'), userController.updateUserProfile);

//khóa/mở khóa tài khoản
router.put("/block/:id", middlewareControllers.verifyTokenAndAdminAuth, userController.toggleBlockUser);

module.exports = router;