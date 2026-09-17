
import dotenv from "dotenv";
dotenv.config();
import {app} from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed";
import { Server } from "http";





let server : Server;
const bostrap = async () => {
  try {
    await seedSuperAdmin()
    // Start the server
    server=app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// SIGTERM signal handler
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down server...");

    if(server){
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(1);
        });
    } 
    
    process.exit(1);
    
})

// SIGINT signal handler

process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down server...");

    if(server){
        server.close(() => {
            console.log("Server closed gracefully.");
            process.exit(1);
        });

    }

    process.exit(1);
});

//uncaught exception handler
process.on('uncaughtException', (error) => {
    console.log("Uncaught Exception Detected... Shutting down server", error);

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

process.on("unhandledRejection", (error) => {
    console.log("Unhandled Rejection Detected... Shutting down server", error);

    if(server){
        server.close(() => {
            process.exit(1);
        })
    }

    process.exit(1);
})

bostrap();