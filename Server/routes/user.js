const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
require('dotenv').config();
const jwt = require("jsonwebtoken");
const userAuth = require("../middlewares/user.Auth");

// Welcome Route
router.get("/", (req, res) => {
    res.send("🌟 Welcome to the Authentication Service!");
});

// User Signup
router.post("/api/signup", async (req, res) => {
    const { name, userName, email, password } = req.body;
    console.log(name, userName, email, password);
    if (!name || !email || !userName || !password) {
        return res.status(422).json({ error: "⚠️ Please fill in all the fields!" });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ email }, { userName }]
        });

        if (existingUser) {
            return res
                .status(422)
                .json({ error: "❌ User already exists with that email or username!" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            name,
            email,
            userName,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: "✅ Registration successful! Welcome aboard 🎉" });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(500).json({ error: "❌ Something went wrong. Please try again later." });
    }
});

// User Signin
router.post("/api/signin", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "⚠️ Email and password are required!" });
    }

    try {
        const savedUser = await User.findOne({ email });

        if (!savedUser) {
            return res.status(401).json({ error: "❌ Invalid email. Please try again!" });
        }

        const isPasswordMatch = await bcrypt.compare(password, savedUser.password);

        if (isPasswordMatch) {
            const token = jwt.sign({ _id: savedUser.id }, process.env.Jwt_secret);
            const { _id, name, email, userName } = savedUser;

            return res.status(200).json({
                message: "✅ Successfully signed in! 🚀",
                token,
                user: { _id, name, email, userName }
            });
        } else {
            return res.status(401).json({ error: "❌ Incorrect password. Please try again!" });
        }
    } catch (err) {
        console.error("Error during signin:", err);
        res.status(500).json({ error: "❌ Something went wrong. Please try again later." });
    }
});

module.exports = router;
