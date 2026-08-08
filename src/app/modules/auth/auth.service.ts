import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { IRequestUser } from "../../interfaces/requestUserInterfaces";
import { jwtUtils } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { IChangePasswordRequest } from "./auth.interfaces";

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


const getMe = async (user: IRequestUser) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            id: user.userId,
        },
        include: {
            patient: {
                include: {
                    appointments: true,
                    prescriptions: true,
                    reviews: true,
                }
            },
            doctor: {
                include: {
                    appointments: true,
                    specialties: true,
                    prescriptions: true,
                    reviews: true,
                    doctorSchedules: true,
                }
            },
            admin: true,
        }
    })

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, "User not found");
    }

    return isUserExist;
}

const getNewToken = async (refreshToken : string, sessionToken : string) => {

    const isSessionTokenExists = await prisma.session.findUnique({
        where : {
            token : sessionToken,
        },
        include : {
            user : true,
        }
    })

    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, envVars.REFRESH_TOKEN_SECRET)


    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw new AppError(status.UNAUTHORIZED, "Invalid refresh token");
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const newAccessToken = tokenUtils.getAccessToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const newRefreshToken = tokenUtils.getRefreshToken({
        userId: data.userId,
        role: data.role,
        name: data.name,
        email: data.email,
        status: data.status,
        isDeleted: data.isDeleted,
        emailVerified: data.emailVerified,
    });

    const {token} = await prisma.session.update({
        where : {
            token : sessionToken
        },
        data : {
            token : sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt: new Date(),
        }
    })

    return {
        accessToken : newAccessToken,
        refreshToken : newRefreshToken,
        sessionToken : token,
    }

}


const changePassword = async (payload : IChangePasswordRequest, sessionToken : string) =>{

    const session = await auth.api.getSession({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(!session){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const {currentPassword, newPassword} = payload;

    const result = await auth.api.changePassword({
        body :{
            currentPassword,
            newPassword,
            revokeOtherSessions: true,  //logout from all other sessions except the current one
        },
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(session.user.isPasswordNeedChange){
        await prisma.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                isPasswordNeedChange: false,
            }
        })
    }

    const accessToken = tokenUtils.getAccessToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });

    const refreshToken = tokenUtils.getRefreshToken({
        userId: session.user.id,
        role: session.user.role,
        name: session.user.name,
        email: session.user.email,
        status: session.user.status,
        isDeleted: session.user.isDeleted,
        emailVerified: session.user.emailVerified,
    });
    

    return {
        ...result,
        accessToken,
        refreshToken,
    }
}

const logoutUser = async (sessionToken : string) => {
    const result = await auth.api.signOut({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    return result;
}


export const authService = {
    registerPatient,
    loginPatient,
    getMe,
    getNewToken,
    changePassword,
    logoutUser
}