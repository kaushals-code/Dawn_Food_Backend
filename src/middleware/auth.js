import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import db from "../config/db.js";

const loginRouter = express.Router();

loginRouter.get("/", async (req, res) => {

    try {

        const { type, password } = req.body;

        let value;
        let query;

        if (type === "email") {

            value = req.body.email;

            query = `
                SELECT id, email, phone, password, role
                FROM users
                WHERE email = $1
            `;

        }
        else if (type === "phone") {

            value = req.body.phone;

            query = `
                SELECT id, email, phone, password, role
                FROM users
                WHERE phone = $1
            `;

        }
        else {

            return res.status(400).json({
                message: "Invalid login type"
            });

        }

        const result = await db.query(query, [value]);

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        const user = result.rows[0];

        const match = await bcrypt.compare(
            password,
            user.password
        );

        if (!match) {

            return res.status(401).json({
                message: "Invalid credentials"
            });

        }

        const token = jwt.sign(
            {
                user_id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({

            message: "Login successful",

            token,

            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role
            }

        });

    }
    catch (err) {

        return res.status(500).json({
            message: "An error occurred",
            error: err.message
        });

    }

});

export default loginRouter;