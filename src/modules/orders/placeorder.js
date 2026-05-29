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

        let total = 0;

        usercart.forEach(element => {

            let got = false;
            allmenu.forEach(item => {
                if (item.id == element) {
                    total += item.base_price;
                    got = true;
                    break;
                }
            });

            if (got === false) {
                return res.status(407).send({
                    message: "An item in the cart is not avaliable in the restaurant"
                });
            } // Confirmed that all the items are present int he cart

            // Got the total price also
            // Need to add the delivery charges also according to the distance. 
            let delivery_fee = 50;
            let tax = 0.18 * total;

            // Add discount of 10%
            let discount = (0.15 * total);

            const addOrder = db.query(
                `insert into orders(customer_id, restaurant_id, 
                driver_id, sub_total, tax, delivery_fee, discount_amount, total)
                values ($1, $2, $3, $4, $5, $6, $7, $8)`,
                [user_id, res_id, driver_id, total,]
            );

        });

    } catch (err) {

        res.status(501).send({
            message: "Internal Server Error",
            error: err.message
        })

    }

});

export default placeOrderForUser;