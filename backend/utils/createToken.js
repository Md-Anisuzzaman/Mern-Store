import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {

    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.EXPIRE_DAYS,
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 60 * 24 * 60 * 1000
    });
    return token;
};

export default generateToken;