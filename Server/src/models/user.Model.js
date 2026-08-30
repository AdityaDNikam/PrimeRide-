import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        FirstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
            minlength: [3, "First name must be at least 3 characters long"],
            maxlength: [50, "First name must be at most 50 characters long"],
        },
        LastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
            minlength: [3, "Last name must be at least 3 characters long"],
            maxlength: [50, "Last name must be at most 50 characters long"],
        },
        EmailId: {
            type: String,
            required: [true, "Email ID is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        PhoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            unique: true,
            trim: true,
        },
        SocketId: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
        RefreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.hashPassword = async function () {
    return await bcrypt.hash(this.password, 10);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);

