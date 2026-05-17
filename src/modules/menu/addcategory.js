import express from "express";
import db from "../../config/db.js";

const createMenuCategoryRouter = express.Router();

createMenuCategoryRouter.post("/", async (req, res) => {

    const { user_id, role } = req.user;

    try {

        if (role !== "res_owner") {
            return res.status(403).json({
                message: "Only restaurant owners can create categories"
            });
        }

        // Find restaurant of logged-in owner
        const restaurantResult = await db.query(
            `SELECT id FROM restaurants 
             WHERE owner_id = $1`,
            [user_id]
        );

        if (restaurantResult.rows.length === 0) {
            return res.status(404).json({
                message: "Restaurant not found"
            });
        }

        const restaurant_id = restaurantResult.rows[0].id;

        const { category_name } = req.body;

        if (!category_name) {
            return res.status(400).json({
                message: "Category name required"
            });
        }

        const checkIfThere = await db.query(
            `select * from menu_categories where name = $1 && restaurand_id = $2`, [category_name, restaurant_id]
        )

        if (checkIfThere.rows[0].length > 0) {
            return res.status(201).send({
                message: "Category already exists!"
            })
        }

        const categoryResult = await db.query(
            `INSERT INTO menu_categories
            (restaurant_id, name)
            VALUES ($1,$2)
            RETURNING *`,
            [restaurant_id, category_name]
        );

        return res.status(201).json({
            message: "Category created successfully",
            category: categoryResult.rows[0]
        });

    } catch (err) {

        return res.status(500).json({
            message: "Internal server error",
            error: err.message
        });

    }

});

export default createMenuCategoryRouter;