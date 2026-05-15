import jwt from "jsonwebtoken";

const tokenverify = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        console.log("Decoded token:", decoded);

        next();

    } catch (err) {

        return res.status(401).json({
            message: "Invalid or expired token",
            error: err,
        });

    }

}

export default tokenverify;