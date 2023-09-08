import allowedOrigins from "../src/config/allowed_origins.js"; 

const credentials = (req, res, next) => {
    const origin = req.headers.origins;

    if(allowedOrigins.includes(origin)) {
        res.headers('Access-Control-Allow-Origin', true);
    }

    next();
}

export default credentials