import express from "express"

import db from "../../config/db.js";
import { redisClient } from "../../config/redis.js";
import getDriver from "../../middleware/assigndriver.js";

const placeOrderForUser = express.Router();

placeOrderForUser.post("/", async (req, res) => {

    const { user_id } = req.user;

    const raw = await redisClient.get(user_id);
    if (!raw) {
        return res.status(204).send({ message: "No items are added to the cart." });
    }
    const usercart = JSON.parse(raw);

    console.log(usercart);
    console.log(typeof usercart);

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

        for (const element of cart) {
            let got = false;

            for (const item of allmenu) {
                if (item.id == element) {
                    console.log(item.base_price);
                    console.log(typeof item.base_price);
                    total += parseFloat(item.base_price);
                    got = true;
                    break;
                }
            }

            if (!got) {
                return res.status(407).send({
                    message: "An item in the cart is not available in the restaurant"
                });
            }
        }

        // Got the total price also
        // Need to add the delivery charges also according to the distance. 
        let delivery_fee = 50;
        let tax = 0.18 * total;

        // driver_id need to be get from another middleware for now let it be the driver with driver_id = 1
        const driver_id = await getDriver();

        // Add discount of 10%
        let discount = (0.15 * total);

        const finalTotal = total + tax + delivery_fee - discount;

        const addOrder = await db.query(
            `insert into orders(customer_id, restaurant_id, 
                driver_id, subtotal, tax, delivery_fee, discount_amount, total)
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning id`,
            [user_id, res_id, driver_id, total, tax, delivery_fee, discount, finalTotal]
        );

        const order_id = addOrder.rows[0].id;

        const addOrderItems = await db.query(
            `insert into order_items (order_id, 
                items_order) values
                ($1, $2)`,
            [order_id, cart]
        );

        await redisClient.del(String(user_id));

        return res.status(203).send({
            message: "Order placed successfully"
        })


    } catch (err) {

        res.status(501).send({
            message: "Internal Server Error",
            error: err.message
        })

    }

});

export default placeOrderForUser;