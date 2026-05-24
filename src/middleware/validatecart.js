import express from "express";

import { redisClient } from "../config/redis.js";
import db from "../config/db.js";

const validatecart = express.Router();

validatecart.get("/", async (req, res) => {

    const { user_id } = req.user;

    const cart = await redisClient.get(user_id);

    if (cart == null) {
        return res.status(403).send({
            message: "No items add into the cart"
        });
    }

    try {

        const menu = await db.query(
            `select * from menu_items where restaurant_id = $1`,
            [cart.res_id]
        );

        const items = cart.items;

        items.forEach(element => {

        });

        res.send("The Weeknd is the goat")

    } catch (err) {

        return res.status(404).send({
            message: "Internal Server Error",
            error: err.message
        })

    }

});