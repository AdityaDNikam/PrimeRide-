import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.Routes.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/api/v1/connectionCheck", (req, res) => {
    res.json({ message: "Backend connection successful!" })
})

app.use("/api/v1/users/", userRoutes);


export default app;