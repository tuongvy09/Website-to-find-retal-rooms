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

    updateUserProfile: async (req, res) => {
        try {
            const userId = req.params.id; 
            const { name, phone, address, avatar, bio} = req.body;
    
            let updatedFields = {
                username: name,
                "profile.phone": phone,
                "profile.address": address,
                "profile.bio": bio,
                "profile.avatar": avatar,  
            };
    
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { $set: updatedFields },
                { new: true, runValidators: true }
            );
    
            if (!updatedUser) {
                return res.status(404).json({ message: "User not found" });
            }
    
            res.status(200).json({
                message: "User profile updated successfully",
                user: updatedUser,
            });
        } catch (error) {
            console.error("Error updating user profile:", error);
            res.status(500).json({
                message: "Server error",
                error: error.message,
            });
        }
    }
}

module.exports = userController;