import dotenv from "dotenv";
import express from "express";

import db from "./src/config/db.js";
import tokenverify from "./src/middleware/tokenverify.js";

// For login and registration
import loginRouter from "./src/middleware/auth.js";
import userregroutes from "./src/modules/users/user_registration.js";
import resownerRegisterRouter from "./src/modules/restaurants/restaurantowner_registration.js";
import driverRegisterRouter from "./src/modules/drivers/driver_registration.js";

// For restaurants
import restaurantRegisterRouter from "./src/modules/restaurants/restaurant_registration.js";
import restaurantUpdateRouter from "./src/modules/restaurants/restaurant_update.js";

// For update and get user profiles
import getuserprofile from "./src/modules/users/user_profile.js";
import updateuserprofile from "./src/middleware/users_update.js";

// For menu management
import createMenuCategoryRouter from "./src/modules/menu/addcategory.js";
import addItemMenuRouter from "./src/modules/menu/additem_menu.js";
import getFullMenu from "./src/modules/menu/get_menu.js";
import editMenu from "./src/modules/menu/edit_menu.js";
import deleteCategoryRouter from "./src/modules/menu/deletein_menu.js";
import deleteItemRouter from "./src/modules/menu/deleteitem_menu.js";

dotenv.config();

const app = express();
const port = 3000;

db.connect().catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// For all logins
app.use("/auth/login", loginRouter);
app.use("/userdetails", tokenverify, getuserprofile);
app.use("/restaurant/update", tokenverify, restaurantUpdateRouter);
app.use("/userdetails/update", tokenverify, updateuserprofile);

// For all registrations
app.use("/auth/register", userregroutes);
app.use("/restaurantowner/register", resownerRegisterRouter);
app.use("/restaurant/register", tokenverify, restaurantRegisterRouter);
app.use("/driver/register", driverRegisterRouter);

// For menu related end points
app.use("/menu/addcategory", tokenverify, createMenuCategoryRouter);
app.use("/menu/additem", tokenverify, addItemMenuRouter);
app.use("/fullmenu", getFullMenu);
app.use("/editmenu", tokenverify, editMenu);
app.use("/delinmenu", tokenverify, deleteCategoryRouter);
app.use("/delitemmenu", tokenverify, deleteItemRouter);


app.get("/", (req, res) => {
    res.send("The Weeknd is the GOAT");
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});