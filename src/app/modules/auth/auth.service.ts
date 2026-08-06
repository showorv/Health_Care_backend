import { UserStatus } from "../../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";

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
        throw new Error("Failed to register patient");
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
     return {...data, patient};
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
        throw new Error("Failed to login patient");
    }

    if(data.user.status !== UserStatus.ACTIVE) {
        throw new Error("User is not active");
    }

    if(data.user.isDeleted) {
        throw new Error("User is deleted");
    }

   

    return data;
}
export const authService = {
    registerPatient,
    loginPatient
}