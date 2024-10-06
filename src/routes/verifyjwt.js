import jwt from "jsonwebtoken";

export default function verifyJWT(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    // const token = undefined;
    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) return res.status(403).json({
                status: "Failed",
                isLogin: false,
                message: "Falló la autenticación"
            })
            req.user = {}
            req.user.id = decoded.id
            req.user.email = decoded.email
            next()
        })
    } else {
        return res.status(403).json({ status: "Failed", message: "Token incorrecto", isLogin: false})
    }
}