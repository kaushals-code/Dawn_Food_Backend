import express from "express";

import db from "../../config/db.js";
import redisClient from "../../config.js";

const getAllItemsOfCart = express.Router();

getAllItemsOfCart.get("/", async (req, res) => {

    const { user_id, role } = req.user;

    const redisCart = await redisClient.get(user_id);

    try {



    } catch (err) {
        return res.send({
            message: "Internal Server Error",
            error: err.message
        })
    }

});

export default getAllItemsOfCart;