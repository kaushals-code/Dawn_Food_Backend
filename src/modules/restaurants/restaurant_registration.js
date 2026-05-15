import express from "express";

import db from "../../config/db.js";

const restaurantRegisterRouter = express.Router();

restaurantRegisterRouter.post("/", async (req, res) => {

    const { user_id, role } = req.user;

    console.log("Restaurant registration request received from user ID:", user_id);
    console.log("User role from token:", role);

    if (role !== "res_owner") {
        return res.status(403).json({
            message: "You are not authorized to register a restaurant"
        });
    }

    let result;

    try {


        result = await db.query("select * from users where id = $1", [user_id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Restaurant owner not found"
            });

        }

        const { email, phone } = result.rows[0];

        result = await db.query("select * from restaurants where email = $1 or phone = $2", [email, phone]);

        if (result.rows.length > 0) {
            return res.status(400).json({
                message: "A restaurant with the same email or phone number already exists"
            })
        }

        result = await db.query("select * from user_profiles up join user_addresses ua on up.user_id = ua.user_id where up.user_id = $1", [user_id]);

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Restaurant owner profile not found"
            });

        }

        const { full_name } = result.rows[0];

        result = await db.query("insert into restaurants (owner_id, name, phone, email) values ($1, $2, $3, $4) returning id", [user_id, full_name, phone, email]);

        const res_id = result.rows[0].id;
        const { address, lat, lng, city } = req.body;

        await db.query("insert into restaurant_addresses (restaurant_id, address, city, lat, lng) values ($1, $2, $3, $4, $5)", [res_id, address, city, lat, lng]);

        return res.status(201).json({
            message: "Restaurant registered successfully"
        })

    } catch (err) {

        return res.status(500).json({
            message: "An error occurred while registering the restaurant.",
            error: err
        })

    }

});

export default restaurantRegisterRouter;