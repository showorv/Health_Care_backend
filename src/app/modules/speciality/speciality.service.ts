import { Speciality } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createSpeciality = async (payload: Speciality): Promise<Speciality> => {

    const speciality = await prisma.speciality.create({
        data: payload,
    });

    return speciality;
}

const getSpecialities = async (): Promise<Speciality[]> => {
    const specialities = await prisma.speciality.findMany();
    return specialities;
}

const deleteSpeciality = async (id: string): Promise<Speciality | null> => {
    const deletedSpeciality = await prisma.speciality.delete({
        where: { id },
    });
    return deletedSpeciality;
}

export const specialityService = { createSpeciality, getSpecialities, deleteSpeciality };