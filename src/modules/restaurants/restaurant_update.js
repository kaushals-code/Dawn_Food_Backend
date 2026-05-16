import express from "express";

import db from "../../config/db.js";

const restaurantUpdateRouter = express.Router();

restaurantUpdateRouter.patch("/", async (req, res) => {

    const { user_id, role } = req.user;

    const {
        name = null,
        cuisine = null,
        address = null,
        city = null
    } = req.body;

    if (role !== "res_owner") {
        return res.status(403).json({
            message: "You are not authorized to update restaurant details"
        });
    }

    let result;

    try {

        await db.query(
            `update restaurants
             set name = COALESCE($1, name),
             cuisine = COALESCE($2, cuisine)
             where owner_id = $3`,
            [name, cuisine, user_id]
        );

        await db.query(
            `update restaurant_addresses
             set address = COALESCE($1, address),
             city = COALESCE($2, city)
             where restaurant_id = (select id from restaurants where owner_id = $3)`,
            [address, city, user_id]
        );

        return res.status(200).json({
            message: "Restaurant details updated successfully"
        });

    } catch (error) {

        return res.status(500).json({
            message: "An error occurred while updating restaurant details",
            error: error.message
        })

    }

});

export default restaurantUpdateRouter;