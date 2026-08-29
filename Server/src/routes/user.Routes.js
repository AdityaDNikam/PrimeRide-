import express from "express";
import { body } from "express-validator";
import { 
    registerUser, 
    loginUser, 
    logoutUser, 
    updateUserDetails, 
    deleteUser 
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", [
    body("FirstName").isLength({ min: 3 }).withMessage("First Name must be at least 3 characters long"),
    body("LastName").isLength({ min: 3 }).withMessage("Last Name must be at least 3 characters long"),
    body("EmailId").isEmail().withMessage("Email ID must be a valid email address"),
    body("PhoneNumber").isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digits long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],
    registerUser
);

router.post("/login", [
    body("EmailId").optional().isEmail().withMessage("Email ID must be a valid email address"),
    body("PhoneNumber").optional().isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digits long"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],
    loginUser
);

router.post("/logout", verifyJWT, logoutUser);

router.patch("/update-details", [
    verifyJWT,
    body("FirstName").optional().isLength({ min: 3 }).withMessage("First Name must be at least 3 characters long"),
    body("LastName").optional().isLength({ min: 3 }).withMessage("Last Name must be at least 3 characters long"),
    body("EmailId").optional().isEmail().withMessage("Email ID must be a valid email address"),
    body("PhoneNumber").optional().isLength({ min: 10 }).withMessage("Phone Number must be at least 10 digits long"),
    body("password").not().exists().withMessage("Password cannot be updated from this route")
],
    updateUserDetails
);

router.delete("/delete-account", verifyJWT, deleteUser);

export default router;