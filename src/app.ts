import express from "express";

import notFound from "./middlewares/notFound.js";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRoute from "./modules/auth/auth.route.js";

import cookieParser from "cookie-parser";

import cors from "cors";

import userRoute from "./modules/user/user.route.js";
import adminRoute from "./modules/admin/admin.route.js";


const app = express();


app.use(express.json());
app.use(cookieParser());

app.use(
    express.urlencoded({
        extended:true
    })
);



app.get("/",(req,res)=>{

    res.send("RentNest API running");

});


app.use(
    "/api/auth",
    authRoute
);




app.use(
    "/api/users",
    userRoute
);



app.use(
    "/api/admin",
    adminRoute
);

app.use(notFound);


app.use(globalErrorHandler);



app.use(
 cors({
    origin:"http://localhost:3000",
    credentials:true
 })
)



export default app;