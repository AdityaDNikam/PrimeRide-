import { Captain } from "../models/captain.Model.js";
import { ApiError } from "../utils/ApiError.js";

const createCaptain = async ({
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
}) => {
    if (
        !First_Name ||
        !Last_Name ||
        !Gender ||
        !phoneNumber ||
        !Email ||
        !Password ||
        !Regrestration_Num ||
        !Color ||
        !Capacity ||
        !VehicleType
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existingCaptain = await Captain.findOne({
        $or: [
            { "Caption_Details.Email": Email },
            { "Caption_Details.Number": phoneNumber }
        ]
    });

    if (existingCaptain) {
        throw new ApiError(400, "Captain with this email or phone number already exists");
    }

    const captain = await Captain.create({
        Caption_Details: {
            First_Name,
            Last_Name,
            Gender,
            Number: phoneNumber,
            Email,
            Password,
            SocketId
        },
        Vehicle: {
            Regrestration_Num,
            Color,
            Capacity,
            VehicleType
        }
    });

    return captain;
};

const loginCaptainService = async ({ Email, Number: phoneNumber, Password }) => {
    if (!Password) {
        throw new ApiError(400, "Password is required");
    }

    if (!Email && !phoneNumber) {
        throw new ApiError(400, "Email or Phone Number is required");
    }

    const captain = await Captain.findOne({
        $or: [
            { "Caption_Details.Email": Email || "" },
            { "Caption_Details.Number": phoneNumber || "" }
        ]
    }).select("+Caption_Details.Password");

    if (!captain) {
        throw new ApiError(401, "Invalid email/phone or password");
    }

    const isPasswordValid = await captain.comparePassword(Password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email/phone or password");
    }

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

    // Since we don't have RefreshToken stored in captain Schema, we just return the tokens.
    // However, we exclude the password field from the returned captain object.
    const loggedInCaptain = await Captain.findById(captain._id).select("-Caption_Details.Password");

    return { captain: loggedInCaptain, accessToken, refreshToken };
};

const updateCaptainService = async (captainId, updateData) => {
    const captain = await Captain.findById(captainId);
    if (!captain) {
        throw new ApiError(404, "Captain not found");
    }

    if (updateData.Caption_Details?.Password) {
        throw new ApiError(400, "Password cannot be updated from this route");
    }

    // Merge Caption_Details safely
    if (updateData.Caption_Details) {
        for (const [key, value] of Object.entries(updateData.Caption_Details)) {
            if (value !== undefined) {
                captain.Caption_Details[key] = value;
            }
        }
    }

    // Merge Vehicle details safely
    if (updateData.Vehicle) {
        for (const [key, value] of Object.entries(updateData.Vehicle)) {
            if (value !== undefined) {
                captain.Vehicle[key] = value;
            }
        }
    }

    if (updateData.Status !== undefined) {
        captain.Status = updateData.Status;
    }

    // Merge location details safely
    if (updateData.location) {
        for (const [key, value] of Object.entries(updateData.location)) {
            if (value !== undefined) {
                captain.location[key] = value;
            }
        }
    }

    // Check uniqueness constraints if fields are changed
    if (
        updateData.Caption_Details?.Email &&
        updateData.Caption_Details.Email !== captain.Caption_Details.Email
    ) {
        const existingEmail = await Captain.findOne({ "Caption_Details.Email": updateData.Caption_Details.Email });
        if (existingEmail) {
            throw new ApiError(400, "Email already in use");
        }
    }

    if (
        updateData.Caption_Details?.Number &&
        updateData.Caption_Details.Number !== captain.Caption_Details.Number
    ) {
        const existingNumber = await Captain.findOne({ "Caption_Details.Number": updateData.Caption_Details.Number });
        if (existingNumber) {
            throw new ApiError(400, "Phone number already in use");
        }
    }

    if (
        updateData.Vehicle?.Regrestration_Num &&
        updateData.Vehicle.Regrestration_Num !== captain.Vehicle.Regrestration_Num
    ) {
        const existingRegNum = await Captain.findOne({ "Vehicle.Regrestration_Num": updateData.Vehicle.Regrestration_Num });
        if (existingRegNum) {
            throw new ApiError(400, "Registration number already in use");
        }
    }

    await captain.save();
    return captain;
};

const deleteCaptainService = async (captainId, password) => {
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const captain = await Captain.findById(captainId).select("+Caption_Details.Password");
    if (!captain) {
        throw new ApiError(404, "Captain not found");
    }

    const isPasswordValid = await captain.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect password");
    }

    const deletedCaptain = await Captain.findByIdAndDelete(captainId);
    if (!deletedCaptain) {
        throw new ApiError(404, "Captain not found");
    }

    return deletedCaptain;
};

const updateCaptainPasswordService = async (captainId, oldPassword, newPassword) => {
    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Both old password and new password are required");
    }

    if (oldPassword === newPassword) {
        throw new ApiError(400, "New password cannot be the same as the old password");
    }

    const captain = await Captain.findById(captainId).select("+Caption_Details.Password");
    if (!captain) {
        throw new ApiError(404, "Captain not found");
    }

    const isPasswordValid = await captain.comparePassword(oldPassword);
    if (!isPasswordValid) {
        throw new ApiError(401, "Incorrect old password");
    }

    captain.Caption_Details.Password = newPassword;
    await captain.save();

    const updatedCaptain = await Captain.findById(captainId).select("-Caption_Details.Password");
    return updatedCaptain;
};

export { 
    createCaptain, 
    loginCaptainService, 
    updateCaptainService,
    deleteCaptainService,
    updateCaptainPasswordService
};
