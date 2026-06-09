import express from "express";

import db from "../../config/db.js";

const getAllItemsOfCart = express.Router();

getAllItemsOfCart.get("/", async (req, res) => {

    const { user_id, role } = req.user;

});

export default getAllItemsOfCart;