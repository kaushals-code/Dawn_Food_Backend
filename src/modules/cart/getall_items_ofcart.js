import express from "express";

import db from "../../config/db.js";

const getAllItemsOfCart = express.Router();

getAllItemsOfCart.get("/", async (req, res) => {

});

export default getAllItemsOfCart;