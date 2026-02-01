


interface Roles{
    [key:string]:number
}
interface Permsisons{
    [key:number]:number[]
}
export const roles:Roles={
    "Harshal":1,
    "User":2,
    "Harshal2":3   
}
export const Permsisons:Permsisons = {
    1: [1,2,3,4],
    2: [2], 
    3: [2,3] 
  };