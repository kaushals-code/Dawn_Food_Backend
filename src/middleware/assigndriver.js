import express from "express";

import db from "../config/db.js";

async function getDriver() {
    const driver = await db.query(
        `select id from drivers where status = $1`,
        ['false']
    );

    console.log(driver.rows);
    return driver.rows[0].id;
}

export default getDriver;