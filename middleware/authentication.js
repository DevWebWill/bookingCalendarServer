import jwt from 'jsonwebtoken';
import User from '../src/models/User.model.js';

const authentication = async (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(authHeader?.startsWith('Bearer')) {
        //console.log(authHeader)
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if(err) {
                console.log('fail 1', token)
                req.user = {};
                return next();
            }

            const user = await User.findById(decoded.id).select({ password: 0, refresh_token: 0 }).exec();

            if(user) {
                req.user = user.toObject({ getters: true });
            } else {
                console.log('fail 2')
                req.user = {};        
            }

            return next();
        });
    } else {
        console.log('fail 3')
        req.user = {};
        return next();
    }
}

export default authentication;