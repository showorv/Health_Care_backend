import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";

interface RegisterPatientInput {
    name: string;
    email: string;
    password: string;
}

const registerPatient = async (payload: RegisterPatientInput) => {

    const {name, email, password}= payload;

    const data = await auth.api.signUpEmail({
        body: {
            name,
            email,
            password,
            // as default
            // role: "PATIENT",
            // status: "ACTIVE",
            // needPasswordChange: false,
            // isDeleted: false,
            // deletedAt: null
        }
    })

 if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to register patient");
    }
    //transition will be here for save patient data in patient model


    try{

          const patient = await prisma.$transaction(async (tx) => {
        const patientTx = await tx.patient.create({
            data: {
                userId: data.user.id,
                name: name,
                email: email,
            },
        });
        return patientTx;
    })
   
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            accessToken,
            refreshToken,
            patient
        }
    }catch (error) {

        console.error("Error saving patient data:", error);

        await prisma.user.delete({
            where: { id: data.user.id },
        });
        throw error;

    }
  
   
}

const loginPatient = async (email: string, password: string) => {
    const data = await auth.api.signInEmail({
        body: {
            email,
            password
        }
    })

    if (!data.user) {
        throw new AppError(status.BAD_REQUEST, "Failed to login patient");
    }

    if(data.user.status !== UserStatus.ACTIVE) {
        throw new AppError(status.FORBIDDEN, "User is not active");
    }

    if(data.user.isDeleted) {
        throw new AppError(status.FORBIDDEN, "User is deleted");
    }

   
        const accessToken = tokenUtils.getAccessToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        const refreshToken = tokenUtils.getRefreshToken({
            userId: data.user.id,
            role: data.user.role,
            name: data.user.name,
            email: data.user.email,
            status: data.user.status,
            isDeleted: data.user.isDeleted,
            emailVerified: data.user.emailVerified,
        });

        return {
            ...data,
            accessToken,
            refreshToken
        }
}
export const authService = {
    registerPatient,
    loginPatient
}