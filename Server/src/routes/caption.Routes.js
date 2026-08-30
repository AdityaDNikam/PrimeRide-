import express from "express";
import { body } from "express-validator";
import { 
    registerCaptain, 
    loginCaptain, 
    logoutCaptain, 
    updateCaptain,
    deleteCaptain,
    updateCaptainPassword
} from "../controllers/caption.controller.js";
import { verifyCaptainJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", [
    body("First_Name").isLength({ min: 3 }).withMessage("First Name must be at least 3 characters long"),
    body("Last_Name").isLength({ min: 3 }).withMessage("Last Name must be at least 3 characters long"),
    body("Gender").isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other"),
    body("Number").isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digits long"),
    body("Email").isEmail().withMessage("Email must be a valid email address"),
    body("Password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("Regrestration_Num").notEmpty().withMessage("Registration Number is required"),
    body("Color").notEmpty().withMessage("Color is required"),
    body("Capacity").isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("VehicleType").isIn(["bike", "car", "auto"]).withMessage("Vehicle type must be bike, car, or auto")
],
    registerCaptain
);

router.post("/login", [
    body("Email").optional().isEmail().withMessage("Email must be a valid email address"),
    body("Number").optional().isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digits long"),
    body("Password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],
    loginCaptain
);

router.post("/logout", verifyCaptainJWT, logoutCaptain);

router.patch("/update-details", [
    verifyCaptainJWT,
    body("Caption_Details.First_Name").optional().isLength({ min: 3 }).withMessage("First Name must be at least 3 characters long"),
    body("Caption_Details.Last_Name").optional().isLength({ min: 3 }).withMessage("Last Name must be at least 3 characters long"),
    body("Caption_Details.Gender").optional().isIn(["male", "female", "other"]).withMessage("Gender must be male, female, or other"),
    body("Caption_Details.Number").optional().isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digits long"),
    body("Caption_Details.Email").optional().isEmail().withMessage("Email must be a valid email address"),
    body("Caption_Details.Password").not().exists().withMessage("Password cannot be updated from this route"),
    body("Vehicle.Regrestration_Num").optional().notEmpty().withMessage("Registration number cannot be empty"),
    body("Vehicle.Color").optional().notEmpty().withMessage("Color cannot be empty"),
    body("Vehicle.Capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be at least 1"),
    body("Vehicle.VehicleType").optional().isIn(["bike", "car", "auto"]).withMessage("Vehicle type must be bike, car, or auto")
],
    updateCaptain
);

router.patch("/update-password", [
    verifyCaptainJWT,
    body("oldPassword").isLength({ min: 6 }).withMessage("Old password must be at least 6 characters long"),
    body("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters long")
],
    updateCaptainPassword
);

router.delete("/delete-account", [
    verifyCaptainJWT,
    body("Password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],
    deleteCaptain
);

export default router;
