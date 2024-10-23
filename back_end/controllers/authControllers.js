const bcrypt = require("bcrypt"); //hash pass
const User = require("../models/User");

const authController = {
    //REGISTER
    registerUser: async(req, res) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            //create new user
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            //save to DB
            const user = await newUser.save();
            res.status(200).json(user);
        }catch(err){
            // res.status(200).json(err);
            console.error("Error details: ", err);  // In chi tiết lỗi ra console
            res.status(500).json({ error: "An error occurred", details: err.message });
        }
    },

    //LOGIN
    loginUser: async(req, res) => {
        try{
            const user = await User.findOne({username: req.body.username});
            if(!user){
                res.status(404).json("Wrong username!");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword){
                res.status(404).json("Wrong password!");
            }
            if(user && validPassword) {
                res.status(200).json(user);
            }
            
        }catch(err){
            res.status(500).json(err);
        }
    },
};

module.exports = authController;