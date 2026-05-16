import express from "express";

import db from "../config/db.js";

const updateuserprofile = express.Router();

updateuserprofile.patch("/", async (req, res) => {

    const { user_id, role } = req.user;

    console.log(req.user);
    console.log(user_id, role);

    const {
        email = null,
        phone = null,
        full_name = null,
        date_of_birth = null,
        address_line = null,
        city = null,
        state = null,
        gender = null
    } = req.body;

    let result;

    try {

        result = await db.query(
            "select * from users where (email = $1 or phone = $2) and id != $3",
            [email, phone, user_id]
        );

        if (result.rowCount > 0) {
            return res.status(400).json({
                message: "Email or phone number already exists"
            });
        }

        const updatedUser = await db.query(
            `UPDATE users
             SET email = COALESCE($1, email),
                 phone = COALESCE($2, phone)
             WHERE id = $3
             RETURNING *`,
            [email, phone, user_id]
        );

        // console.log("Updated users:");
        // console.log(updatedUser.rows);

        const updatedProfile = await db.query(
            `UPDATE user_profiles
             SET full_name = COALESCE($1, full_name),
                 date_of_birth = COALESCE($2, date_of_birth),
                 gender = COALESCE($3, gender)
             WHERE user_id = $4
             RETURNING *`,
            [full_name, date_of_birth, gender, user_id]
        );

        // console.log("Updated profile:");
        // console.log(updatedProfile.rows);

        const updatedAddress = await db.query(
            `UPDATE user_addresses
             SET address_line = COALESCE($1, address_line),
                 city = COALESCE($2, city),
                 state = COALESCE($3, state)
             WHERE user_id = $4
             RETURNING *`,
            [address_line, city, state, user_id]
        );

        // console.log("Updated address:");
        // console.log(updatedAddress.rows);

        if (role === "driver") {

            const {
                vehicle_type = null,
                license_number = null,
                license_plate = null
            } = req.body;

            const updatedDriver = await db.query(
                `update drivers
                 set vehicle_type = COALESCE($1, vehicle_type),
                     license_number = COALESCE($2, license_number),
                     license_plate = COALESCE($3, license_plate)
                 where user_id = $4
                 returning *`,
                [vehicle_type, license_number, license_plate, user_id]
            );

            // console.log("Updated driver:");
            // console.log(updatedDriver.rows);
        }

        return res.status(200).json({
            message: "Profile updated successfully"
        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({
            message: "Internal Server Error",
            "error-message": err.message,
            error: err
        });

    }

});

export default updateuserprofile;