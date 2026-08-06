
import dotenv from "dotenv";
dotenv.config();
import {app} from "./app";
import { envVars } from "./app/config/env";





const bostrap = async () => {
  try {
    // Start the server
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

bostrap();