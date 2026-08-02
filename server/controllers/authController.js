const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ==========================================
// REGISTER USER
// ==========================================

const register = (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    // Check if user already exists
    User.findByEmail(email, async (err, result) => {
        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length > 0) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        try {
            // Encrypt password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Save user
            User.create(
                name,
                email,
                hashedPassword,
                (err, result) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Registration failed"
                        });
                    }

                    res.status(201).json({
                        success: true,
                        message: "User registered successfully"
                    });
                }
            );

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    });
};


// ==========================================
// LOGIN USER
// ==========================================

const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    User.findByEmail(email, async (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result[0];

        try {
            // Compare entered password with encrypted password
            const passwordMatch = await bcrypt.compare(
                password,
                user.password
            );

            if (!passwordMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid email or password"
                });
            }

            // Create login token
            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
                }
            );

            res.status(200).json({
                success: true,
                message: "Login successful",

                token,

                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                }
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    });
};


module.exports = {
    register,
    login
};