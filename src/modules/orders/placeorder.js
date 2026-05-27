import express from "express"

import db from "../../config/db.js";
import { redisClient } from "../../config/redis.js";

const placeOrderForUser = express.Router();

placeOrderForUser.post("/", async (req, res) => {

    const { user_id } = req.user;

    const usercart = redisClient.get(user_id);

    if (usercart === null) {
        return res.status(204).send({
            message: "No items are added to the cart."
        });
    }

    try {

        // check all the item are present in the menu_items
        // make the new order

        const { cart, res_id } = usercart;

        const allResItems = await db.query(
            `select * from menu_items
            where restaurant_id = $1`,
            [res_id]
        );

        const allmenu = allResItems.rows;

        usercart.forEach(element => {

            let l = 0, r = usercart.length;

            while (l <= r) {

                let mid = l + (r - l) / 2;

                // if()

            }

        });

    } catch (err) {

        res.status(501).send({
            message: "Internal Server Error",
            error: err.message
        })

    }

});

export default placeOrderForUser;