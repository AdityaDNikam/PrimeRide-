import { User } from "../models/user.Model.js";
import { ApiError } from "../utils/ApiError.js";

const createUser = async ({
    FirstName,
    LastName,
    EmailId,
    PhoneNumber,
    password
}) => {
    if (!FirstName || !LastName || !EmailId || !PhoneNumber || !password) {
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.create({
        FirstName,
        LastName,
        EmailId,
        PhoneNumber,
        password
    });

    return user;
};

const loginUserService = async ({ EmailId, PhoneNumber, password }) => {
    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    if (!EmailId && !PhoneNumber) {
        throw new ApiError(400, "Email or Phone Number is required");
    }

    // Find user by either EmailId or PhoneNumber, and include the password field
    const user = await User.findOne({
        $or: [
            { EmailId: EmailId || "" },
            { PhoneNumber: PhoneNumber || "" }
        ]
    }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email/phone or password");
    }

    // Check if the password is correct
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email/phone or password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.RefreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // Exclude password from returned user object
    const loggedInUser = await User.findById(user._id).select("-password");

    return { user: loggedInUser, accessToken, refreshToken };
};

const updateUserDetailsService = async (userId, { FirstName, LastName, EmailId, PhoneNumber }) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (EmailId && EmailId !== user.EmailId) {
        const existingEmail = await User.findOne({ EmailId });
        if (existingEmail) {
            throw new ApiError(400, "Email already in use");
        }
        user.EmailId = EmailId;
    }

    if (PhoneNumber && PhoneNumber !== user.PhoneNumber) {
        const existingPhone = await User.findOne({ PhoneNumber });
        if (existingPhone) {
            throw new ApiError(400, "Phone number already in use");
        }
        user.PhoneNumber = PhoneNumber;
    }

    if (FirstName) user.FirstName = FirstName;
    if (LastName) user.LastName = LastName;

    await user.save();
    return user;
};

const deleteUserService = async (userId) => {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }
    return deletedUser;
};

export { createUser, loginUserService, updateUserDetailsService, deleteUserService };