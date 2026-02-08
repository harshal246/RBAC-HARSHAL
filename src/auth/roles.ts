


interface Roles{
    [key:string]:number
}

interface RolesName{
    [key:number]:string
}
interface Permsisons{
    [key:number]:number[]
}

interface Permsisons2{
    [key:string]:number
}
export const roles:Roles={
    "Harshal":1,
    "User":2,
    "Harshal2":3   
}
export const rolesName:RolesName={
    1:"admin",
    2:"user",
    3:"Manager"
}

export const Permsisons:Permsisons = {
    1: [1,2,3,4],
    2: [2], 
    3: [2,3] 
  };

export const PermissionsTransformation:Permsisons2={
    "create_records":1,
    "read_records":2,
    "update_records":3,
    "delete_records":4
}