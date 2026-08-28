import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        FirstName: {
            type: String,
            required: [true, "First name is required"],
            trim: true,
        },
        LastName: {
            type: String,
            required: [true, "Last name is required"],
            trim: true,
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
        SockitId: {
            type: String,
            required: [true, "Socket ID is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
