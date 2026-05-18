import express from "express";

import db from "../../config/db.js";

const getFullMenu = express.Router();

// Get full menu of a restaurant
getFullMenu.get("/:id", async (req, res) => {

    const res_id = req.params.id;

    // console.log(res_id);

    try {

        const isrestaurant = await db.query(
            `select * from restaurants where id = $1`, [res_id]
        );

        if (isrestaurant.rows.length === 0) {
            return res.status(404).send({
                message: "No restaurant fonud!"
            })
        }

        const result = await db.query(
            `select
            r.name,
            json_agg(
                json_build_object(
                    'category', c.name,
                    'items', (
                        select json_agg(
                            json_build_object(
                                'id', m.id,
                                'name', m.name,
                                'price', m.base_price
                            )
                        )                
                        from menu_items m 
                        where m.category_id = c.id
                    )
                )
            )  as menu
            from restaurants r
            join menu_categories c
            on r.id = c.restaurant_id
            where r.id = $1
            group by r.name`,
            [res_id]
        );

        res.status(200).send(result.rows[0]);

    } catch (err) {

        return res.status(201).send({
            message: "Some error occurred",
            error: err.message
        });

    }

});

// Get full menu of a restarurant by a category
getFullMenu.get("/:id/:category", async (req, res) => {

    const res_id = req.params.id;
    const cat = req.params.category;

    try {

        const checkCat = await db.query(
            `select * from menu_categories where name = $1`, [cat]
        );

        if (checkCat.rows[0].length == 0) {
            res.status(501).send({
                message: "No such category found!"
            })
        }

        const result = await db.query(
            `select json_build_object(
            'restaurant', r.name,
            'category', c.name,
            'items',
            (
                select json_agg(
                    json_build_object(
                        'id', i.id,
                        'name', i.name,
                        'price', i.base_price
                    )
                )
                from menu_items i
                where i.category_id = c.id
                )
            ) as menu
            from restaurants r
            join menu_categories c
            on r.id = c.restaurant_id
            where r.id = $2
            and c.name = $1;
            `,
            [cat, res_id]
        );

        return res.status(201).send(result.rows[0]);


    } catch (err) {

        return res.status(500).send({
            messgae: 'Internal Server Error',
            error: err.message
        });

    }

});

export default getFullMenu;