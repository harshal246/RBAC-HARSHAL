


interface Roles{
    [key:string]:number
}
interface Permsisons{
    [key:number]:string
}
export const roles:Roles={
    "Harshal":1,
    "User":2,
    "Harshal2":3   
}
export const Permsisons:Permsisons = {
    1: "create_records read_records update_records delete_records",
    2: "read_records", 
    3: "read_records update_records" 
  };