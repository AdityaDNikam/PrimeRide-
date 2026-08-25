import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);


connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("MONGODB connection failed", err);
});