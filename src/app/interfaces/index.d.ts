import { IRequestUser } from "./requestUserInterfaces";


declare global {
    namespace Express {
        interface Request {
            user?: IRequestUser;
        }
    }
}