import express from "express";

import { redisClient } from "../../config/redis.js";
import db from "../../config/db.js";

const cartItemAddRouter = express.Router();

cartItemAddRouter.post("/", async (req, res) => {

    const { user_id, role } = req.user;

    let cur = await redisClient.get(user_id).then((got) => JSON.parse(got));

    console.log(cur);

    const { new_item_id, new_res_id } = req.body;

    try {

        // check the cart is present or not
        if (cur == null) {

            const fresh_cart = {
                user_id: user_id,
                res_id: new_res_id,
                cart: [parseInt(new_item_id)]
            };

            await redisClient.set(user_id, JSON.stringify(fresh_cart));

            return res.status(201).send({
                message: "Item added to the cart successfully"
            })

        }

        let cart = cur.cart;

        for (let i = 0; i < cart.length; i++) {
            if (cart[i] == new_item_id) {
                return res.status(401).send({
                    message: "The item already exists"
                })
            }
        }

        const res_id = cur.res_id;

        if (new_res_id != res_id) {
            return res.status(402).send({
                message: "The cart can contain only single restaurant items"
            });
        }

        // check the restaurant and the new_item_id exist
        const checkRestaurant = await db.query(
            `select * from restaurants where id = $1`,
            [res_id]
        );

        if (checkRestaurant.rows.size === 0) {
            return res.status(404).send({
                message: "No restaurant found"
            });
        }

        const checkItemInRestaurant = await db.query(
            `select * from menu_items where restaurant_id = $1 and id = $2`,
            [res_id, new_item_id]
        );

        if (checkItemInRestaurant.rows.length === 0) {
            return res.status(404).send({
                message: "No such item exists"
            });
        }

        cart.push(parseInt(new_item_id));

        const new_cart = JSON.stringify({
            user_id: user_id,
            res_id: res_id,
            cart: cart
        });

        // console.log(cart);

        await redisClient.set(user_id, new_cart);

        return res.status(201).send({
            message: "New Item added successfully"
        });

    } catch (err) {

        return res.status(500).send({
            message: "Internal server error",
            error: err.message
        })

    }

});

export default cartItemAddRouter;