import express from "express";
import db from "../../config/db.js";

const addItemMenuRouter = express.Router();

addItemMenuRouter.post("/", async (req, res) => {

    const { user_id, role } = req.user;

    try {

        if (role !== "res_owner") {
            return res.status(403).json({
                message: "Only restaurant owners can add menu items"
            });
        }

        // find restaurant
        const restaurantResult = await db.query(
            `SELECT id
             FROM restaurants
             WHERE owner_id=$1`,
            [user_id]
        );

        if (restaurantResult.rows.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const restaurant_id = restaurantResult.rows[0].id;

        const {
            category_name,
            item_name,
            item_description,
            item_price,
            is_available,
            is_veg
        } = req.body;

        // find category by category name
        const categoryResult = await db.query(
            `SELECT id
             FROM menu_categories
             WHERE name=$1
             AND restaurant_id=$2`,
            [category_name, restaurant_id]
        );

        if (categoryResult.rows.length === 0) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        const category_id = categoryResult.rows[0].id;

        await db.query(
            `INSERT INTO menu_items
            (
                category_id,
                restaurant_id,
                name,
                description,
                base_price,
                is_available,
                is_veg
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7)`,
            [
                category_id,
                restaurant_id,
                item_name,
                item_description,
                item_price,
                is_available,
                is_veg
            ]
        );

        return res.status(201).json({
            message: "Menu item added successfully"
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });

    }

});

export default addItemMenuRouter;