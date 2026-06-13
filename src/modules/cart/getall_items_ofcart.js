import express from "express";

import db from "../../config/db.js";
import { redisClient } from "../../config/redis.js";

const getAllItemsOfCart = express.Router();

getAllItemsOfCart.get("/", async (req, res) => {

    const { user_id, role } = req.user;

    try {

        const redisCart = await redisClient.get(user_id).then(resp => JSON.parse(resp));


        if (redisCart === null || redisCart.cart === []) {
            return res.status(404).send({
                message: "No items added to the cart"
            });
        }

        const ids = redisCart.cart.map(item => item);

        const result = await db.query(
            `select id, name, base_price from menu_items
            where id = any($1)`,
            [ids]
        );

        console.log(result.rows);

        return res.status(200).send("Check your console dawg");

    } catch (err) {
        return res.send({
            message: "Internal Server Error",
            error: err.message
        })
    }

});

export default getAllItemsOfCart;