import { Captain } from "../models/captain.Model.js";
import { ApiError } from "../utils/ApiError.js";

const createCaptain = async ({
    First_Name,
    Last_Name,
    Gender,
    Number: phoneNumber,
    Email: emailId,
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
        !emailId ||
        !Password ||
        !Regrestration_Num ||
        !Color ||
        !Capacity ||
        !VehicleType
    ) {
        throw new ApiError(400, "All fields are required");
    }

    const normalizedEmail = emailId.trim().toLowerCase();
    const normalizedPhone = phoneNumber.trim();

    const existingCaptain = await Captain.findOne({
        $or: [
            { "Caption_Details.EmailId": normalizedEmail },
            { "Caption_Details.PhoneNumber": normalizedPhone }
        ]
    });

    if (existingCaptain) {
        throw new ApiError(400, "Captain with this email or phone number already exists");
    }

    const captain = await Captain.create({
        Caption_Details: {
            First_Name: First_Name.trim(),
            Last_Name: Last_Name.trim(),
            Gender,
            PhoneNumber: normalizedPhone,
            EmailId: normalizedEmail,
            Password,
            SocketId
        },
        Vehicle: {
            Regrestration_Num: Regrestration_Num.trim(),
            Color: Color.trim(),
            Capacity: Number(Capacity),
            VehicleType
        }
    });

    return captain;
};

const loginCaptainService = async ({ Email, Number: phoneNumber, EmailId, PhoneNumber, Password, password }) => {
    const rawEmail = EmailId || Email || "";
    const rawPhone = PhoneNumber || phoneNumber || "";
    const pass = Password || password;

    if (!pass) {
        throw new ApiError(400, "Password is required");
    }

    const normalizedEmail = rawEmail.trim().toLowerCase();
    const normalizedPhone = rawPhone.trim();

    const orConditions = [];
    if (normalizedEmail) {
        orConditions.push({ "Caption_Details.EmailId": normalizedEmail });
    }
    if (normalizedPhone) {
        orConditions.push({ "Caption_Details.PhoneNumber": normalizedPhone });
    }

    if (orConditions.length === 0) {
        throw new ApiError(400, "Email or Phone Number is required");
    }

    const captain = await Captain.findOne({ $or: orConditions }).select("+Caption_Details.Password");

    if (!captain) {
        throw new ApiError(401, "Invalid email/phone or password");
    }

    const isPasswordValid = await captain.comparePassword(pass);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email/phone or password");
    }

    const accessToken = captain.generateAccessToken();
    const refreshToken = captain.generateRefreshToken();

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
    const details = updateData.Caption_Details || {};
    if (details.First_Name) captain.Caption_Details.First_Name = details.First_Name.trim();
    if (details.Last_Name) captain.Caption_Details.Last_Name = details.Last_Name.trim();
    if (details.Gender) captain.Caption_Details.Gender = details.Gender;

    const newEmail = (details.Email || details.EmailId || "").trim().toLowerCase();
    if (newEmail && newEmail !== captain.Caption_Details.EmailId) {
        const existingEmail = await Captain.findOne({ "Caption_Details.EmailId": newEmail });
        if (existingEmail) {
            throw new ApiError(400, "Email already in use");
        }
        captain.Caption_Details.EmailId = newEmail;
    }

    const newPhone = (details.Number || details.PhoneNumber || "").trim();
    if (newPhone && newPhone !== captain.Caption_Details.PhoneNumber) {
        const existingNumber = await Captain.findOne({ "Caption_Details.PhoneNumber": newPhone });
        if (existingNumber) {
            throw new ApiError(400, "Phone number already in use");
        }
        captain.Caption_Details.PhoneNumber = newPhone;
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

const getCaptainProfileService = async (captainId) => {
    const captain = await Captain.findById(captainId).select("-Caption_Details.Password");
    if (!captain) {
        throw new ApiError(404, "Captain not found");
    }
    return captain;
};

export { 
    createCaptain, 
    loginCaptainService, 
    updateCaptainService,
    deleteCaptainService,
    updateCaptainPasswordService,
    getCaptainProfileService
};
