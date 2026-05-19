import express from "express";

import db from "../../config/db.js";

const deleteItemRouter = express.Router();

deleteItemRouter.delete("/:category/:item", async (req, res) => {

    const { user_id } = req.user;

    const cat = req.params.category;
    const item = req.params.item;

    try {

        const getResId = await db.query(
            `select id from restaurants where owner_id = $1`,
            [user_id]
        );

        const res_id = getResId.rows[0].id;

        const checkCategory = await db.query(
            `select * from menu_categories where name = $1 and restaurant_id = $2`,
            [cat, res_id]
        );

        if (checkCategory.rows.length === 0) {
            return res.status(404).send({
                message: "No such category found"
            });
        }

        const cat_id = checkCategory.rows[0].id;

        // console.log(cat_id);
        // console.log(res_id);
        // console.log(item);

        const checkItem = await db.query(
            `select from menu_items where category_id = $1 and restaurant_id = $2 and name = $3`,
            [cat_id, res_id, item]
        );

        if (checkItem.rows.length === 0) {
            return res.status(404).send({
                message: "No such item found in the category"
            })
        }

        const result = await db.query(
            `delete from menu_items where category_id = $1 and restaurant_id = $2 and name = $3`,
            [cat_id, res_id, item]
        );

        return res.status(201).send({
            message: "Item deleted successfully"
        })

    } catch (err) {

        res.status(501).send({
            messgage: "Internal Server Error",
            error: err.message
        })

    }

});

export default deleteItemRouter;