import express from "express";
import bcrypt from "bcrypt";

import db from "../../config/db.js";

const saltRounds = 12;

const resownerRegisterRouter = express.Router();

resownerRegisterRouter.post('/', async (req, res) => {

    // Get the user data from the reques body
    const { email, phone, password, fullname, dob, address, city, state } = req.body;

    try {

        // check if the email already exits

        const result = await db.query("select * from users where email = $1 or phone = $2", [email, phone]);

        if (result.rows.length > 0) {
            return res.status(400).json({ message: "User with this email or phone number already exists." });
        }

        const hash = await bcrypt.hash(password, saltRounds);

        const insertedUser = await db.query(
            `insert into users (email, phone, password, role, created_at) values ($1, $2, $3, $4, $5) returning id`,
            [
                email,
                phone,
                hash,
                "res_owner",
                new Date()
            ]
        );

        const userId = insertedUser.rows[0].id;

        console.log(userId);

        await db.query(
            `insert into user_profiles (user_id, full_name) values ($1,$2)`,
            [
                userId,
                fullname
            ]
        );

        await db.query(
            `insert into user_addresses (user_id, address_line, city, state) values ($1,$2,$3,$4)`,
            [
                userId,
                address,
                city,
                state,
            ]
        );

        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        res.status(500).json({
            message: "An error occurred while registering the user.",
            error: err,
        });
    }

});

export default resownerRegisterRouter;