import { Permission } from "../models/Permission";
import { Role } from "../models/Roles";

export const can = (roles: Role[], role: Array<string>): boolean => {
    let haverole = roles?.find(r => role.includes(r.name));
    return haverole ? true : false;
}


export const have = (permissions: Permission[], permission: Array<string>): boolean => {
    let havepermission = permissions?.find(p => permission.includes(p.name));
    return havepermission ? true : false;
}