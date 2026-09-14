import express from "express";
import notFound from "./middlewares/notFound.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import authRoute from "./modules/auth/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./modules/user/user.route.js";
import adminRoute from "./modules/admin/admin.route.js";
import categoryRoute from "./modules/category/category.route.js";
import propertyRoute from "./modules/property/property.route.js";


const app = express();

app.use(
 cors({
    origin:"http://localhost:3000",
    credentials:true
 })
)


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



app.use(
    "/api/categories",
    categoryRoute
);

app.use(
    "/api",
    propertyRoute
);

app.use(notFound);

app.use(globalErrorHandler);


export default app;