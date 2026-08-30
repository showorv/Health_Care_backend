
import dotenv from "dotenv";
dotenv.config();
import {app} from "./app";
import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seed";





const bostrap = async () => {
  try {
    await seedSuperAdmin()
    // Start the server
    app.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

bostrap();