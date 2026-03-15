import jwt from "jsonwebtoken";

const SECRET = "mysecretkey";

export default function (req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
        return res.status(401).json({
            message: "Token required",
        });
    }

    try {
        const decoded = jwt.verify(token, SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid Token",
        });
    }
}
