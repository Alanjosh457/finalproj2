const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Folder = require("../Schemas/folderSchema");
const Formbot = require("../Schemas/formbotSchema");
const User = require("../Schemas/user.schema");
const dotenv = require("dotenv");
const isLoggedIn = require("../middleware/auth");

dotenv.config();

// Create a new folder
router.post("/create-folder", isLoggedIn, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user?._id;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const folder = new Folder({
      name,
      user: userId,
      formbots: [],
    });

    await folder.save();

    user.folders = user.folders || [];
    user.folders.push(folder._id);
    await user.save();

    res.status(201).json(folder);
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "An error occurred while creating the folder" });
  }
});

// Create a new formbot
// Create a new formbot

// Create a new formbot inside a folder

router.post("/create-formbot", isLoggedIn, async (req, res) => {
  try {
    console.log('Request received to create formbot:', req.body);  // Log the request body

    const { name, folderId } = req.body;
    console.log('Extracted data: name:', name, 'folderId:', folderId);  // Log the extracted values

    const userId = req.user?._id;
    console.log('User ID:', userId);  // Log user ID to check if it’s being passed correctly

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      console.log('Invalid name:', name);  // Log invalid name
      return res.status(400).json({ error: "Formbot name is required" });
    }

    if (folderId && !mongoose.Types.ObjectId.isValid(folderId)) {
      console.log('Invalid folderId format:', folderId);  // Log invalid folderId
      return res.status(400).json({ error: "Invalid folder ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);  // Log if user is not found
      return res.status(404).json({ error: "User not found" });
    }

    let formbot;
    console.log('Proceeding to create formbot');

    if (folderId) {
      const folder = await Folder.findById(folderId);
      if (!folder) {
        console.log('Folder not found for folderId:', folderId);  // Log if folder is not found
        return res.status(404).json({ error: "Folder not found" });
      }

      console.log('Folder found:', folder);  // Log folder found

      formbot = new Formbot({
        name,
        user: userId,
      });

      folder.formbots.push(formbot._id);
      await folder.save();

      console.log('Folder after adding formbot:', folder);  // Log after formbot is added to folder
    } else {
      formbot = new Formbot({
        name,
        user: userId,
      });
    }

    console.log('Formbot to be saved:', formbot);  // Log before saving the formbot
    await formbot.save();
    console.log('Created formbot:', formbot);  // Log after formbot is saved

    res.status(201).json(formbot);
  } catch (error) {
    console.error("Error creating formbot:", error);
    res.status(500).json({ error: "An error occurred while creating the formbot" });
  }
});



// Fetch all folders for the logged-in user
router.get("/fetchfolders", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user?._id;
    const folders = await Folder.find({ user: userId }).populate("formbots");
    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ error: "An error occurred while fetching folders" });
  }
});

// Fetch all formbots for the logged-in user
router.get("/fetchformbots", isLoggedIn, async (req, res) => {
  try {
    const userId = req.user?._id;
    const formbots = await Formbot.find({ user: userId }).populate("folder");
    res.status(200).json(formbots);
  } catch (error) {
    console.error("Error fetching formbots:", error);
    res.status(500).json({ error: "An error occurred while fetching formbots" });
  }
});
router.get('/formbot/:formbotId', isLoggedIn, async (req, res) => {
  try {
    const { formbotId } = req.params;
    // Find the formbot by ID
    const formbot = await Formbot.findById(formbotId);
    
    if (!formbot) {
      return res.status(404).json({ message: 'Formbot not found' });
    }

    res.json(formbot); // Send formbot data back to the client
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
