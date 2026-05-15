import express from "express";

import db from "../../config/db.js";

const getuserprofile = express.Router();

getuserprofile.get("/", (req, res) => {

    const { user_id, role } = req.user;

    let email, phone, user_role, created_at;
    let full_name, dob, gender;
    let address_line, city, state;
    let result;

    try {

        result = db.query("select email, phone, role, created_at from users where id = $1", [user_id]);

        email = result.rows[0].email;
        phone = result.rows[0].phone;
        user_role = result.rows[0].role;
        created_at = result.rows[0].created_at;

        result = db.query("select full_name, date_of_birth, gender from user_profiles where user_id = $1", [user_id]);

        full_name = result.rows[0].full_name;
        dob = result.rows[0].date_of_birth;
        gender = result.rows[0].gender;

        result = db.query("select address_line, city, state from user_addresses where user_id = $1", [user_id]);

        address_line = result.rows[0].address_line;
        city = result.rows[0].city;
        state = result.rows[0].state;

        return res.status(200).json({
            "email": email,
            "phone": phone,
            "role": user_role,
            "created_at": created_at,
            "full_name": full_name,
            "date_of_birth": dob,
            "gender": gender,
            "address_line": address_line,
            "city": city,
            "state": state
        });

    } catch (err) {

        return res.status(500).json({ message: "Internal Server Error" });

    }

});

export default getuserprofile;