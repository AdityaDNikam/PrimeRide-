import { validationResult } from "express-validator";
import { 
    createCaptain, 
    loginCaptainService, 
    updateCaptainService,
    deleteCaptainService,
    updateCaptainPasswordService
} from "../services/caption.service.js";
import { ApiResponce } from "../utils/ApiResponce.js";
import asyncHandler from "../utils/AsyncHandler.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
};

const registerCaptain = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { 
        First_Name, 
        Last_Name, 
        Gender, 
        Number: phoneNumber, 
        Email, 
        Password, 
        Regrestration_Num, 
        Color, 
        Capacity, 
        VehicleType,
        SocketId
    } = req.body;

    const captain = await createCaptain({
        First_Name,
        Last_Name,
        Gender,
        Number: phoneNumber,
        Email,
        Password,
        Regrestration_Num,
        Color,
        Capacity,
        VehicleType,
        SocketId
    });

    const token = captain.generateAccessToken();

    return res
        .status(201)
        .json(new ApiResponce(201, { captain, token }, "Captain registered successfully"));
});

const loginCaptain = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Email, Number: phoneNumber, Password } = req.body;

    const { captain, accessToken, refreshToken } = await loginCaptainService({
        Email,
        Number: phoneNumber,
        Password
    });

    console.log(`Captain Login Success : ${captain.Caption_Details.First_Name}, ${captain.Caption_Details.Last_Name}`);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponce(
                200,
                { captain, accessToken, refreshToken },
                "Captain logged in successfully"
            )
        );
});

const logoutCaptain = asyncHandler(async (req, res) => {
    console.log(`Captain Logged Out Success : ${req.captain.Caption_Details.First_Name}, ${req.captain.Caption_Details.Last_Name}`);

    return res
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .redirect("/login");
});

const updateCaptain = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const updatedCaptain = await updateCaptainService(req.captain._id, req.body);

    return res
        .status(200)
        .json(new ApiResponce(200, updatedCaptain, "Captain details updated successfully"));
});

const deleteCaptain = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Password } = req.body;

    await deleteCaptainService(req.captain._id, Password);

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponce(200, {}, "Captain account deleted successfully"));
});

const updateCaptainPassword = asyncHandler(async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { oldPassword, newPassword } = req.body;

    const updatedCaptain = await updateCaptainPasswordService(req.captain._id, oldPassword, newPassword);

    return res
        .status(200)
        .json(new ApiResponce(200, updatedCaptain, "Captain password updated successfully"));
});

export { 
    registerCaptain, 
    loginCaptain, 
    logoutCaptain, 
    updateCaptain,
    deleteCaptain,
    updateCaptainPassword
};
