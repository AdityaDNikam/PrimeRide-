import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema(
    {
        Caption_Details: {
            First_Name: {
                type: String,
                required: [true, "First name is required"],
                trim: true,
                minlength: [3, "First name must be at least 3 characters long"],
            },
            Last_Name: {
                type: String,
                required: [true, "Last name is required"],
                trim: true,
                minlength: [3, "Last name must be at least 3 characters long"],
            },
            Gender: {
                type: String,
                required: [true, "Gender is required"],
                enum: {
                    values: ["male", "female", "other"],
                    message: "Gender must be male, female, or other",
                },
            },
            Number: {
                type: String,
                required: [true, "Phone number is required"],
                unique: true,
                trim: true,
                minlength: [10, "Phone number must be at least 10 digits long"],
            },
            Email: {
                type: String,
                required: [true, "Email is required"],
                unique: true,
                lowercase: true,
                trim: true,
            },
            Password: {
                type: String,
                required: [true, "Password is required"],
                minlength: [6, "Password must be at least 6 characters long"],
                select: false,
            },
            SocketId: {
                type: String,
                unique: true,
            }
        },
        Vehicle: {
            Regrestration_Num: {
                type: String,
                required: [true, "Registration number is required"],
                unique: true,
                trim: true,
            },
            Color: {
                type: String,
                required: [true, "Vehicle color is required"],
                trim: true,
            },
            Capacity: {
                type: Number,
                required: [true, "Vehicle capacity is required"],
                min: [1, "Capacity must be at least 1"],
            },
            VehicleType: {
                type: String,
                required: [true, "Vehicle type is required"],
                enum: {
                    values: ["bike", "car", "auto"],
                    message: "Vehicle type must be bike, car, or auto",
                },
            },
        },
        Status: {
            type: String,
            enum: ["active", "inactive"],
            default: "inactive",
        },
        location: {
            lat: {
                type: Number,
            },
            long: {
                type: Number,
            },
        },
    },
    {
        timestamps: true,
    }
);

captainSchema.pre("save", async function () {
    if (!this.isModified("Caption_Details.Password")) return;

    this.Caption_Details.Password = await bcrypt.hash(this.Caption_Details.Password, 10);
});

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.Caption_Details.Password);
};

captainSchema.methods.generateAccessToken = function () {
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

captainSchema.methods.generateRefreshToken = function () {
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

export const Captain = mongoose.model("Captain", captainSchema);
