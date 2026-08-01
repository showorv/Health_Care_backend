
// Import the driver adapter for your specific database (example uses PostgreSQL)
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";
import dotenv from "dotenv";
dotenv.config();
console.log("dburl",process.env.DATABASE_URL);
// Initialize the adapter according to your driver's requirements
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
console.log("Prisma initialized");
// Pass the adapter instance to PrismaClient
const prisma = new PrismaClient({ adapter });

export { prisma };