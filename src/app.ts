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
import rentalRoute from "./modules/rental/rental.route.js";
import paymentRoute from "./modules/payment/payment.route.js";
import reviewRoute from "./modules/review/review.route.js";
import { paymentController } from "./modules/payment/payment.controller.js";


const app = express();

app.use(
 cors({
    origin:"http://localhost:3000",
    credentials:true
 })
)

app.use(cookieParser());

app.post(
    "/api/payments/webhook",
    express.raw({
        type:"application/json"
    }),
    paymentController.webhook
);


app.use(express.json());


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



app.use(
    "/api/rentals",
    rentalRoute
);

app.use(
    "/api/payments",
    paymentRoute
);

app.use(
    "/api/reviews",
    reviewRoute
);


app.use(notFound);

app.use(globalErrorHandler);


export default app;