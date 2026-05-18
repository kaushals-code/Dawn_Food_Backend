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

        if (checkCategory.rows.length === 0) {
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

// For Editing the full item details with its category
editMenu.patch("/:id/:category/:item", async (req, res) => {

    const res_id = req.params.id;
    const cat = req.params.category;
    const item = req.params.item;

    try {

        const checkCategory = await db.query(
            `select * from menu_categories where restaurant_id = $1 and name = $2`, [res_id, cat]
        );

        if (checkCategory.rows.length === 0) {
            return res.status(501).send({
                message: "Category does not exist for the Restaurant"
            });
        }

        const checkItem = await db.query(
            `select * from menu_items 
        where category_id = (select id from menu_categories where name = $1)
        and restaurant_id = $2
        and name = $3`,
            [cat, res_id, item]
        );

        if (checkItem.rows.length === 0) {
            return res.status(501).send({
                message: "No such item found in this give category"
            });
        }

        const {
            new_item = null,
            new_price = null,
            new_description = null,
            new_is_veg = null
        } = req.body;

        console.log(req.body);
        console.log(new_price);

        const result = await db.query(
            `update menu_items
            set name = coalesce($1, name),
            base_price = coalesce($2, base_price),
            description = coalesce($3, description),
            is_veg = coalesce($4, is_veg)
            where name = $5 and category_id = (
            select id from menu_categories 
            where name = $6 
            and restaurant_id = $7 
            )
            and restaurant_id = $8`,
            [new_item, new_price, new_description, new_is_veg, item, cat, res_id, res_id]
        );

        return res.status(201).send({
            message: "The item updated successfully"
        });

    } catch (err) {

        return res.status(501).send({
            message: "Internal Server Error",
            error: err.message
        })

    }

});

export default editMenu;