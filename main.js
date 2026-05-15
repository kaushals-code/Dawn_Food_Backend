import dotenv from "dotenv";
import express from "express";

import db from "./src/config/db.js";
import tokenverify from "./src/middleware/tokenverify.js";

import userregroutes from "./src/modules/users/user_registration.js";
import restaurantRegisterRouter from "./src/modules/restaurants/restaurant_registration.js";
import resownerRegisterRouter from "./src/modules/restaurants/restaurantowner_registration.js";
import loginRouter from "./src/middleware/auth.js";
import driverRegisterRouter from "./src/modules/drivers/driver_registration.js";
import getuserprofile from "./src/modules/users/user_profile.js";

dotenv.config();

const app = express();
const port = 3000;

db.connect().catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth/register", userregroutes);
app.use("/restaurantowner/register", resownerRegisterRouter);
app.use("/restaurant/register", tokenverify, restaurantRegisterRouter);
app.use("/auth/login", loginRouter);
app.use("/driver/register", driverRegisterRouter);
app.use("/userdetails", tokenverify, getuserprofile);

app.get("/", (req, res) => {
    res.send("The Weeknd is the GOAT");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});