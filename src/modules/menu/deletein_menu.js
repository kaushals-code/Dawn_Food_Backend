import express from "express";

import db from "../../config/db.js";

const deleteCategoryRouter = express.Router();

deleteCategoryRouter.delete("/:category", async (req, res) => {

    const { user_id } = req.user;

    console.log(req.user);

    const cat = req.params.category;

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

        // console.log(checkCategory);

        if (checkCategory.rows.length === 0) {
            return res.status(404).send({
                message: "No such category found"
            })
        }

        // delete all the items of the category from the menu_items
        await db.query(
            `delete from menu_items where restaurant_id = $1 
            and category_id = (select id from menu_categories where name = $2)`,
            [res_id, cat]
        );

        // delete from the menu_categories
        await db.query(
            `delete from menu_categories where name = $1 and restaurant_id = $2`,
            [cat, res_id]
        );

        return res.status(201).send({
            message: "Category and its items all deleted successfully"
        })

    } catch (err) {

        return res.status(501).send({
            message: "Internal Server Error",
            error: err.message
        })

    }

});

export default deleteCategoryRouter;