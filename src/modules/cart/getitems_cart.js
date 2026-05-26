import express from "express";

import { redisClient } from "../../config/redis.js";

const getUserCart = express.Router();

getUserCart.get("/", async (req, res) => {

    const { user_id, role } = req.user;

    try {

        const result = await redisClient.get(user_id);

        if (result == null) {
            return res.status(501).send({
                message: "No items added to the cart",
            });
        }

        // console.log(result);

        return res.status(201).send(JSON.parse(result));

    } catch (err) {

        return res.status(404).send({
            message: "Internal Server Error",
            error: err.message
        });

    }

});

export default getUserCart;