import User from "../models/userModel.js"
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";




const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) throw new Error("Fill all inputs")
        const userExist = await User.findOne({ email })
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt)

        if (userExist) res.status(400).send("User already exist")
        const newUser = new User({ username, email, password: hashPassword })
        await newUser.save();
        generateToken(res, newUser._id)
        // return res.status(201).json({ newUser }, { msg: "User registered Successfully👏" })
        new ApiResponse(201, { newUser }, "User registered Successfully👏")
    } catch (error) {
        // res.status(400)
        // throw new Error("invalid user data"){}
        throw new ApiError(400, "Invalid user data")
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (isPasswordValid) {
            generateToken(res, existingUser._id)
            res.status(201).json({ existingUser })
            return;
        }
    }
})
const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "Logged out successfully" })
})

const getAllusers = asyncHandler(async (req, res) => {
    const users = await User.find({})
    res.json(users)
})

// const loginUser = asyncHandler(async (req, res) => {})


export { createUser, loginUser, logoutCurrentUser, getAllusers };