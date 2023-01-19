import { Role } from "../models/Roles";

export const redirectUrl = (roles: Role[]): string => {
    let url = '';
    for (let i = 0; i < roles.length; i++) {
        if(roles[i]?.name === 'administrator') {
            url = '/app';
        } else if(roles[i]?.name === 'merchant') {
            url = '/app/merchant';
        }
    }
    return url;
}