import app from "./app.js";
import prisma from "./lib/prisma.js";
import { config } from "./config/index.js";
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log("Database connected successfully");
        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
        });
    }
    catch (error) {
        console.log("Failed to connect database", error);
        await prisma.$disconnect();
        process.exit(1);
    }
};
startServer();
