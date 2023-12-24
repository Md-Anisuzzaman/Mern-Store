import jwt from 'jsonwebtoken';
import { asyncHandler } from './asyncHandler.js';


export const authenticate = asyncHandler(async (req, res, next) => {
    let token;
    token = req.cookies.jwt
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } catch (error) {
            res.status(401)
            throw new Error("Not authorized, token is failed.")
        }
    } else {
        res.status(401)
        throw new Error("Not authorized, no token.")
    }
})

export const authorizeAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send("Not authorized as admin")
    }
})