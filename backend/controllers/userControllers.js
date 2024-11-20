const User = require("../models/User");

const userController = {
    //get all users
    getAllUsers: async(req, res) => {
        try{
            const users = await User.find();
            res.status(200).json(users);
        } catch(err) {
            // res.status(500).json(err);
            console.error("Error details: ", err);  // In chi tiết lỗi ra console
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    },

    //delete user
    deleteUser: async(req, res) => {
        try{
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Delete successfully!");
        }catch(err){
            res.status(500).json(err);
        }
    },

    //khóa/mở khóa tài khoản
    toggleBlockUser: async (req, res) => {
      try {
        const userId = req.params.id;
        const user = await User.findById(userId);
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        user.profile.isBlocked = !user.profile.isBlocked; // Đảo trạng thái khóa/mở khóa
        await user.save();
    
        res.status(200).json({
          message: `User ${user.profile.isBlocked ? "blocked" : "unblocked"} successfully`,
          user,
        });
      } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
      }
    }
}

  
module.exports = userController;