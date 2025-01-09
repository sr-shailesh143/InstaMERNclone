const jwt = require("jsonwebtoken");
require('dotenv').config();
const mongoose = require("mongoose");
const User = require("../models/user.model");

module.exports = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "🚫 Access denied! Please log in to continue." });
    }

    const token = authorization.replace("Bearer ", "");

    jwt.verify(token, process.env.Jwt_secret, async (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "⚠️ Invalid session! Please log in again." });
        }

        const { _id } = payload;

        try {
        
            const user = await User.findById(_id);

            if (!user) {
                return res.status(404).json({ error: "❌ User not found! Please register or log in." });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(500).json({ error: "⚠️ Server error! Please try again later." });
        }
    });
};