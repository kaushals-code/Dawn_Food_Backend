import express from "express";

import db from "../../config/db.js";
import { redisClient } from "../../config/redis.js";

const getAllItemsOfCart = express.Router();

getAllItemsOfCart.get("/", async (req, res) => {

    const { user_id, role } = req.user;

    try {

        const redisCart = await redisClient.get(user_id);


        if (redisCart === null || redisCart.cart === []) {
            return res.status(404).send({
                message: "No items added to the cart"
            });
        }

        const result = await db.query(
            `select 
            json_build_object(
                'restaurant', r.name,
                select json_build_object(
                    'id', m.id,
                    'name', m.name,
                    'price', m.base_price
                ) from 
                menu_items m
                where 
                restaurant_id = r.id
            )`
        );

    } catch (err) {
        return res.send({
            message: "Internal Server Error",
            error: err.message
        })
    }

});

export default getAllItemsOfCart;