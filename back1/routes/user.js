const express=require("express")
const router=express.Router()
const User=require("../Schemas/user.schema")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const env=require("dotenv")
const isLoggedIn = require("../middleware/auth"); 
env.config()

router.post("/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            res.status(400).json({ message: "Email already taken" });
            return;
        } else {
            const hashedPassword = bcrypt.hashSync(password, 10);
            const newUser = await new User({ email, password: hashedPassword, name }).save();
            
            // Include _id in the JWT token
            const token = jwt.sign({ email, name, _id: newUser._id }, process.env.JWT_SECRET);
            return res.status(200).json({ message: "User created successfully", token, id: newUser._id });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        
        // Include _id in the JWT token
        const token = jwt.sign({ email, name: user.name, _id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ message: "Login successful", token, id: user._id, name: user.name });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});




router.put("/update", isLoggedIn, async (req, res) => {
    try {
        const { name, email, oldPassword, newPassword } = req.body;

        // Get the user ID from the decoded JWT token (already attached in the req.user)
        const userId = req.user._id;  // Use _id from the decoded token
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Validate old password if updating the password
        if (oldPassword && newPassword) {
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "Old password is incorrect" });
            }
            user.password = bcrypt.hashSync(newPassword, 10); // Hash the new password
        }

        // Update name and email if provided
        if (name) user.name = name;
        if (email) {
            const isEmailTaken = await User.findOne({ email });
            if (isEmailTaken && isEmailTaken._id.toString() !== userId) {
                return res.status(400).json({ message: "Email is already taken" });
            }
            user.email = email;
        }

        await user.save(); // Save the updated user details

        // Generate a new token with the updated user data
        const token = jwt.sign({ email: user.email, name: user.name, _id: user._id }, process.env.JWT_SECRET);
        
        return res.status(200).json({ message: "User updated successfully,login to see changes", token, id: user._id, name: user.name });
    } catch (error) {
        console.log("Error updating user:", error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router; 