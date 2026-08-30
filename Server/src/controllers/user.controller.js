import { validationResult } from "express-validator";
import { 
    createUser, 
    loginUserService, 
    updateUserDetailsService, 
    deleteUserService,
    updatePasswordService
} from "../services/user.service.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { User } from "../models/user.Model.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

const registerUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { FirstName, LastName, EmailId, PhoneNumber, password } = req.body;

    const user = await createUser({
        FirstName,
        LastName,
        EmailId,
        PhoneNumber,
        password
    });

    const token = user.generateAccessToken();

    return res
        .status(201)
        .json(new ApiResponce(201, { user, token }, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { EmailId, PhoneNumber, password } = req.body;

    const { user, accessToken, refreshToken } = await loginUserService({
        EmailId,
        PhoneNumber,
        password
    });

    console.log(`User Login Success : ${user.FirstName}, ${user.LastName}`);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponce(
                200,
                { user, accessToken, refreshToken },
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                RefreshToken: 1
            }
        },
        {
            new: true
        }
    );

    console.log(`User Logged Out Success : ${req.user.FirstName}, ${req.user.LastName}`);

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponce(200, {}, "User logged out successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { FirstName, LastName, EmailId, PhoneNumber } = req.body;

    const updatedUser = await updateUserDetailsService(req.user._id, {
        FirstName,
        LastName,
        EmailId,
        PhoneNumber
    });

    return res
        .status(200)
        .json(new ApiResponce(200, updatedUser, "User details updated successfully"));
});

const deleteUser = asyncHandler(async (req, res) => {
    await deleteUserService(req.user._id);

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponce(200, {}, "User deleted successfully"));
});

const updatePassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { oldPassword, newPassword } = req.body;

    const updatedUser = await updatePasswordService(req.user._id, oldPassword, newPassword);

    return res
        .status(200)
        .json(new ApiResponce(200, updatedUser, "Password updated successfully"));
});

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateUserDetails, 
    deleteUser,
    updatePassword
};