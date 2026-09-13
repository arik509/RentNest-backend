import express from "express";

import notFound from "./middlewares/notFound.js";

import globalErrorHandler from "./middlewares/globalErrorHandler.js";


const app = express();


app.use(express.json());

app.use(
    express.urlencoded({
        extended:true
    })
);



app.get("/",(req,res)=>{

    res.send("RentNest API running");

});



app.use(notFound);


app.use(globalErrorHandler);



export default app;