


import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Routes
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

// Middlewares
import { errorHandeler } from "./middlewares/error.middlewares.js";

const app = express();

// ====== MIDDLEWARES ======

// Enable CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Parse JSON and URL-encoded form data
app.use(express.json({ limit: "300kb" }));
app.use(express.urlencoded({ extended: true, limit: "300kb" }));

// Parse cookies
app.use(cookieParser());

// Serve static files (e.g. images, documents)
app.use(express.static("public"));

// ====== ROUTES ======

app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);

// ====== ERROR HANDLER ======
app.use(errorHandeler);

export { app };


























// import express from "express"
// import cors from "cors"
// import cookieParser from "cookie-parser"
// //import routes
// import healthcheckRouter from "./routes/healthcheck.routes.js";
// import userRouter from "./routes/user.routes.js"
// import {errorHandeler} from "./middlewares/error.middlewares.js"
// import {uploadOnCloudinary} from "./utils/cloudinary.js"
// const app=express();
// app.use(
//     cors({
//         origin:process.env.CORS_ORIGIN|| "*",  credentials: true
//     })
// )

// //commen middleware

// app.use(express.json({limit:"300kb"}))
// app.use(express.urlencoded({extended:true,limit:"300kb"}))//when space hit it will give %20 as eg
// app.use(express.static("public"))//where image or other folder is there

// //all routes
// app.use("/api/v1/healthcheck",healthcheckRouter)
// app.use("/api/v1/users",userRouter)
// app.use(errorHandeler)
// export{app}