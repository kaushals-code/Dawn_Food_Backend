import express from "express";
import bcrypt from "bcrypt";

const saltRounds = 12;

import db from "../../config/db.js";

const driverRegisterRouter = express.Router();

driverRegisterRouter.post('/', async (req, res) => {

    // require email, phone, password, fullname, dob, address
    // city, state, gender, vehicle_type, license_number, license_plate

    const { email, phone, password, fullname, dob, address, city, state, gender } = req.body;

    try {

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
                "driver",
                new Date()
            ]
        );

        const id = insertedUser.rows[0].id;

        await db.query(
            "insert into user_profiles (user_id, full_name, date_of_birth, gender) values ($1,$2,$3,$4)",
            [
                id,
                fullname,
                dob,
                gender
            ]
        );

        await db.query(
            "insert into user_addresses (user_id, address_line, city, state) values ($1,$2,$3,$4)",
            [
                id,
                address,
                city,
                state
            ]
        );

        const { vehicle_type, license_number, license_plate } = req.body;
        await db.query(
            "insert into drivers (user_id, license_number, vehicle_type, license_plate) values ($1, $2, $3, $4)",
            [
                id,
                license_number,
                vehicle_type,
                license_plate
            ]
        );

        res.status(201).json({ message: "Driver registered successfully!" });

    } catch (error) {

        return res.status(500).json({ message: "An error occurred while registering the user.", error: error.message });

    }

});

export default driverRegisterRouter;