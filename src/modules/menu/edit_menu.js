import express from "express";

import db from "../../config/db.js";

const editMenu = express.Router();

editMenu.patch("/:id/:category", async (req, res) => {

    const res_id = req.params.id;
    const category = req.params.category;

    console.log(res_id, category);

    try {

        const checkCategory = await db.query(
            `select * from menu_categories where restaurant_id = $1`, [res_id]
        );

        if (checkCategory.rows[0].length === 0) {
            return res.status(501).send({
                message: "Category does not exist for the Restaurant"
            });
        }

        const { new_name } = req.body;

        const result = await db.query(
            `update menu_categories set name = $1 where restaurant_id = $2 and name = $3`,
            [new_name, res_id, category]
        );

        return res.status(201).send({
            message: "Category name updated successfully"
        })

    } catch (err) {

        return res.status(500).send({
            message: "Internal Server Error",
            error: err.message
        });

    }

});

export default editMenu;